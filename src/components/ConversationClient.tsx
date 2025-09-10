"use client";

import { useEffect, useState, useRef } from 'react';
import { useSession } from "next-auth/react";
import { markMessagesAsRead } from "@/actions/messagingActions";
import { useWebSocket } from '@/providers/WebSocketProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";
import TypingIndicator from './TypingIndicator';
import MessageForm from './MessageForm';

import { MessageWithSender } from '@/types/global';

interface ConversationClientProps {
    initialMessages: MessageWithSender[];
    conversationId: string;
    recipientId: string;
}

export default function ConversationClient({ initialMessages, conversationId, recipientId }: ConversationClientProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const { lastMessage } = useWebSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  const addMessage = (message: MessageWithSender) => {
    setMessages(prev => [...prev, message]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    markMessagesAsRead(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'new_message' && lastMessage.payload?.conversationId === conversationId) {
        addMessage(lastMessage.payload as MessageWithSender);
        markMessagesAsRead(conversationId);
        setIsTyping(false);
      }

      if (lastMessage.type === 'messages_read' && lastMessage.payload?.conversationId === conversationId) {
        setMessages(prev =>
          prev.map(msg => ({ ...msg, isRead: true }))
        );
      }

      if (lastMessage.type === 'user_typing' && lastMessage.payload?.conversationId === conversationId) {
        setIsTyping(true);
      }

      if (lastMessage.type === 'user_stopped_typing' && lastMessage.payload?.conversationId === conversationId) {
        setIsTyping(false);
      }
    }
  }, [lastMessage, conversationId]);

  if (!session?.user?.id) return null;

  return (
    <>
      <div className="p-4 flex-grow overflow-y-auto" ref={scrollRef}>
        {messages.map((message) => {
          const isSender = message.senderId === session.user.id;
          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 my-2 ${isSender ? "justify-end" : "justify-start"}`}
            >
              {!isSender && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.image ?? undefined} />
                  <AvatarFallback>{message.sender.firstName?.[0]}{message.sender.lastName?.[0]}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg py-2 px-3 max-w-md ${
                  isSender ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                <p>{message.content}</p>
              </div>
              {isSender && (
                <div className="self-end">
                  {message.isRead ? (
                    <CheckCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Check className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-end gap-2 my-2 justify-start">
              <TypingIndicator />
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-white">
        <MessageForm conversationId={conversationId} recipientId={recipientId} onMessageSent={addMessage} />
      </div>
    </>
  );
}
