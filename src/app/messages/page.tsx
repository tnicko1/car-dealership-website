import { getConversations } from "@/actions/messagingActions";
import { authOptions } from "@/auth.config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ConversationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/');
  }
  const conversations = await getConversations();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      <div className="border rounded-lg">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p.id !== session.user.id
          );

          if (!otherParticipant) {
            return null;
          }

          return (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="flex items-center p-4 border-b hover:bg-gray-50"
            >
              <Avatar>
                <AvatarImage src={otherParticipant.image ?? "/placeholder-avatar.png"} />
                <AvatarFallback>{otherParticipant.firstName?.[0]}{otherParticipant.lastName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-semibold">{otherParticipant.firstName} {otherParticipant.lastName}</p>
                <p className="text-sm text-gray-500">
                  {conversation.messages[0]?.content}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
