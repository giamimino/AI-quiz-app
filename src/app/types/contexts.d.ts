import React from "react";
import { FriendRequestsType, FriendType } from "./connections";

export type SettingsContextCacheRecordType = Partial<
  Record<SettingsContextOpenType, FriendType[] | FriendRequestsType[]>
>;

export type SettingsContextOpenType = "requests" | "friends";

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
}

export interface ChatContextType {
  open: { conversationId: string; isOpen: boolean } | null;
  toggle: () => void;
  close: () => void;
}
