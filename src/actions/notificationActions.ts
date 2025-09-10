"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { revalidatePath } from "next/cache";
import { Notification } from "@prisma/client";

/**
 * Creates a new notification or updates an existing unread one for the same context (link).
 */
export async function createOrUpdateNotification(userId: string, title: string, body: string, link: string): Promise<Notification> {
  // Check for an existing unread notification with the same link
  const existingNotification = await prisma.notification.findFirst({
    where: {
      userId,
      link,
      read: false,
    },
  });

  let notification;
  if (existingNotification) {
    // If found, update it with the new message body and timestamp
    notification = await prisma.notification.update({
      where: {
        id: existingNotification.id,
      },
      data: {
        body,
        createdAt: new Date(), // Bump the timestamp to show it as recent
      },
    });
  } else {
    // Otherwise, create a new notification
    notification = await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        link,
      },
    });
  }

  // Trigger the WebSocket server to push the notification to the client
  try {
    await fetch('http://localhost:3001/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            message: {
                type: 'new_notification',
                notification: notification,
            },
        }),
    });
  } catch (error) {
      console.error('Failed to send real-time notification:', error);
  }

  revalidatePath('/account'); // Revalidate any page where notifications might be displayed
  return notification;
}

/**
 * Fetches all notifications for the currently authenticated user.
 */
export async function getNotifications(): Promise<Notification[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  return prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Marks all unread notifications as read for the currently authenticated user.
 */
export async function markNotificationsAsRead(): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return;
  }

  await prisma.notification.updateMany({
    where: {
      userId: session.user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });

  revalidatePath('/account');
}
