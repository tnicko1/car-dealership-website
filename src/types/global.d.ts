import { Conversation, Message, Review, User } from '@prisma/client';

export type MessageWithSender = Message & {
  sender: User;
};

export type ConversationWithDetails = Conversation & {
    participants: User[];
    messages: Message[];
};

export type ReviewWithReviewer = Review & {
    reviewer: User;
};
