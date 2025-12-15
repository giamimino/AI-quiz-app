import { ChatContextType } from "@/app/types/contexts";
import React, { createContext, useContext, useState } from "react";


export const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [cId, setCId] = useState("")

  const value = {
    open: { isOpen: open, conversationId: cId  },
    toggle: () => setOpen(o => !o),
    close: () => setOpen(false),
    setConversationId: (id: string) =>  setCId(id)
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if(!ctx) throw new Error("useChatContext outside provider.")
  return ctx
}