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
  id: string,
  friend: {
    name: string,
    image: string | null,
    id: string
  }
}

export interface FriendConversationParticant {
  id: string,
  conversationId: string,
  user: {
    name: string,
    image: string | null,
    id: string
  }
}