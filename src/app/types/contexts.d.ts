import React from "react";
import { Conversation, FriendRequestsType, FriendType } from "./connections";

export type SettingsContextCacheRecordType = Partial<
  Record<SettingsContextOpenType, FriendType[] | FriendRequestsType[]>
>;

export type SettingsContextOpenType = "requests" | "friends";

export type LoadingRefType = {
  friends: boolean;
  requests: boolean;
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

export interface ChatContextType {
  conversationId: string;
  close: () => void;
  setConversationId: (id: string) => void;
  conversation: null;
  chatsLoadingRef: React.MutableRefObject<boolean>
}
