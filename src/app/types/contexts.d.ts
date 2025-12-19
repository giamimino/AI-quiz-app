import React from "react";
import { FriendRequestsType, FriendType, Message } from "./connections";

export type SettingsContextCacheRecordType = Partial<
  Record<SettingsContextOpenType, FriendType[] | FriendRequestsType[]>
>;

export type SettingsContextOpenType = "requests" | "friends" | "settings";

export type LoadingRefType = {
  friends: boolean;
  requests: boolean;
  settings: boolean;
};

export interface SettingsContextType {
  open: { isOpen: boolean; type: SettingsContextOpenType };
  toggle: () => void;
  close: () => void;
  changeType: (ty: SettingsContextOpenType) => void;
  structure: { title: string };
  cache: SettingsContextCacheRecordType | null;
  setCache: (
    data: FriendRequestsType[] | FriendType[],
    dataKey: SettingsContextOpenType
  ) => void;
  addCache: (
    data: FriendRequestsType[] | FriendType[],
    dataKey: SettingsContextOpenType
  ) => void;
  clearCache: (dataKey: SettingsContextOpenType) => void;
  loadingRef: React.MutableRefObject<LoadingRefType>;
}

export interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: Message | null;
  _count: { messages: number };
}

export interface ChatContextType {
  conversationId: string;
  close: () => void;
  setConversationId: (id: string) => void;
  conversation: Conversation | null;
  setConversation: (conversation: Conversation) => void;
  chatsLoadingRef: React.MutableRefObject<boolean>;
  onDelete: () => void
}
