import { getMessages, getConversationById } from "@/actions/messagingActions";
import { authOptions } from "@/auth.config";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ConversationTimer from "@/components/ConversationTimer";
import { ShieldCheck } from "lucide-react";
import ConversationClient from "@/components/ConversationClient";

export default async function MessagesPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    notFound();
  }

  const [conversation, messages] = await Promise.all([
    getConversationById(params.id),
    getMessages(params.id)
  ]);

  if (!conversation) {
    notFound();
  }

  const recipient = conversation.participants.find((p) => p.id !== session.user.id);

  if (!recipient) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="border rounded-lg p-4 text-center">
                <h1 className="text-xl font-semibold">Conversation not found</h1>
                <p className="text-gray-500">Could not determine the recipient.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border rounded-lg flex flex-col h-[calc(100vh-10rem)]">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Conversation with {recipient.firstName} {recipient.lastName}</h1>
          <div className="flex items-center gap-2 text-xs mt-1">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <span className="text-gray-500">Messages are secured with encryption.</span>
          </div>
        </div>
        <ConversationTimer updatedAt={conversation.updatedAt} />
        <ConversationClient initialMessages={messages} conversationId={params.id} recipientId={recipient.id} />
      </div>
    </div>
  );
}