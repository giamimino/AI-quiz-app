import { ChatContextType } from "@/app/types/contexts";
import React, { createContext, useContext, useRef, useState } from "react";

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [cId, setCId] = useState("");
  const chatsLoadingRef = useRef<boolean>(true);

  const value = {
    conversationId: cId,
    close: () => setCId(""),
    setConversationId: (id: string) => setCId(id),
    conversation: null,
    chatsLoadingRef,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext outside provider.");
  return ctx;
}
