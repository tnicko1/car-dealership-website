"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "@/actions/messagingActions";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { Message, User } from "@prisma/client";

type MessageWithSender = Message & { sender: User };

interface MessageFormProps {
  conversationId: string;
  recipientId: string;
  onMessageSent: (message: MessageWithSender) => void;
}

export default function MessageForm({ conversationId, recipientId, onMessageSent }: MessageFormProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { sendMessage: sendWsMessage } = useWebSocket();

  const sendTypingStart = () => {
    sendWsMessage({
      type: 'typing_start',
      conversationId,
      recipientId,
    });
  };

  const sendTypingStop = useDebouncedCallback(() => {
    sendWsMessage({
      type: 'typing_stop',
      conversationId,
      recipientId,
    });
  }, 1500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    sendTypingStart();
    sendTypingStop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const text = message;
    setMessage(""); // Clear input immediately for better UX
    sendTypingStop.flush();

    startTransition(async () => {
      const newMessage = await sendMessage(recipientId, text);
      onMessageSent(newMessage as MessageWithSender);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={isPending}
      />
      <Button type="submit" disabled={isPending || !message.trim()}>
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
