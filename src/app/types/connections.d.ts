
export interface FriendRequestsType {
  id: string;
  createdAt: Date;
  requester: {
    id: string;
    username: string;
    image: string | null;
  };
}

export interface FriendType {
  id: string;
  friend: {
    name: string;
    image: string | null;
    id: string;
  };
}

export interface FriendConversationParticant {
  id: string;
  conversationId: string;
  user: {
    name: string;
    image: string | null;
    id: string;
  };
}

export interface ConversationParticants {
  conversationId: string;
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface Message {
  id: string;
  converstationId: string;
  senderId: string;
  text: string;
  createdAt: Date
}

export interface Conversation {
  id: string;
  createdAt: Date;
  lastMessage: Message | null;
  lastMessageId: string | null;
  participants: ConversationParticants[];
  updatedAt: Date;
}
