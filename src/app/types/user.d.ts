import { Challenge } from "./store";

export interface User {
  name: string;
  image: string;
  email: string;
  username: string;
  id: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export interface user {
  name: string;
  image: string;
  email: string;
  id: string;
  reactions: Reactions;
  username: string;
  birthday: string;
  challenges: Challenge[];
  friendRequestsReceived: {
    id: string;
    requester: {
      id: string
    }
  }[];
}

export interface Reactions {
  likes: number;
  favorites: number;
  dislikes: number;
}
