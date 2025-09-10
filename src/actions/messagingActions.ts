"use server";

import prisma from "@/lib/prisma";
import { Message } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { encrypt, decrypt } from "@/lib/encryption";

export async function deleteExpiredConversations() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    try {
        await prisma.conversation.deleteMany({
            where: {
                updatedAt: {
                    lt: oneWeekAgo,
                },
            },
        });
    } catch (error) {
        console.error("Failed to delete expired conversations:", error);
        // We don't throw an error here to not break the user flow
    }
}

import { ConversationWithDetails } from "@/types/global";

export async function getConversations(): Promise<ConversationWithDetails[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Trigger a non-blocking cleanup task
  deleteExpiredConversations();

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      participants: true,
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  // Decrypt the last message for each conversation preview
  return conversations.map(convo => {
    if (convo.messages[0]) {
      convo.messages[0].content = decrypt(convo.messages[0].content);
    }
    return convo;
  });
}

import { MessageWithSender } from "@/types/global";

export async function getMessages(conversationId: string): Promise<MessageWithSender[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (!conversation?.participants.some((p) => p.id === session.user.id)) {
    throw new Error("Unauthorized");
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });

  // Decrypt messages before returning them
  return messages.map(message => ({
    ...message,
    content: decrypt(message.content),
  }));
}

export async function getConversationById(conversationId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            participants: true,
        },
    });

    if (!conversation?.participants.some((p) => p.id === session.user.id)) {
        throw new Error("Unauthorized");
    }

    return conversation;
}

import { createOrUpdateNotification } from "./notificationActions";

export async function sendMessage(
  recipientId: string,
  content: string
): Promise<Message> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user) {
    throw new Error("Unauthorized");
  }

  if (session.user.id === recipientId) {
    throw new Error("You cannot send a message to yourself.");
  }

  // Verify recipient exists
  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
  });

  if (!recipient) {
    throw new Error("Recipient not found.");
  }

  let conversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: session.user.id } } },
        { participants: { some: { id: recipientId } } },
      ],
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: session.user.id }, { id: recipientId }],
        },
      },
    });
  } else {
    conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
    });
  }

  const encryptedContent = encrypt(content);

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      content: encryptedContent,
    },
    include: {
      sender: true,
    }
  });

  const decryptedMessage = { ...message, content: decrypt(message.content) };

  // 1. Trigger real-time message event for the live chat UI
  try {
    await fetch('http://localhost:3001/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: recipientId,
            message: {
                type: 'new_message',
                payload: decryptedMessage,
            },
        }),
    });
  } catch (error) {
      console.error('Failed to send real-time message:', error);
  }

  // 2. Create a notification for the bell and offline users
  const senderName = session.user.username || session.user.firstName || "A user";
  const notificationTitle = `New message from ${senderName}`;
  const notificationLink = `/messages/${conversation.id}`;
  await createOrUpdateNotification(recipientId, notificationTitle, decryptedMessage.content, notificationLink);

  return decryptedMessage;
}

export async function markMessagesAsRead(conversationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Update all messages in this conversation sent TO the current user that are unread
  const { count } = await prisma.message.updateMany({
    where: {
      conversationId: conversationId,
      senderId: {
        not: session.user.id,
      },
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  // If we actually updated any messages, notify the original sender
  if (count > 0) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    const sender = conversation?.participants.find(p => p.id !== session.user.id);

    if (sender) {
      try {
        await fetch('http://localhost:3001/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: sender.id,
                message: {
                    type: 'messages_read',
                    payload: {
                        conversationId: conversationId,
                    },
                },
            }),
        });
      } catch (error) {
          console.error('Failed to send read receipt notification:', error);
      }
    }
  }
}
