import { ChatContextType, Conversation } from "@/app/types/contexts";
import { getConversationSettings } from "@/lib/actions/actions";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [cId, setCId] = useState("");
  const [stateConversation, setSateConversation] =
    useState<Conversation | null>(null);
  const chatsLoadingRef = useRef<boolean>(true);

  const value = {
    conversationId: cId,
    close: () => setCId(""),
    setConversationId: (id: string) => setCId(id),
    setConversation: (conversation: Conversation) =>
      setSateConversation(conversation),
    conversation: stateConversation,
    chatsLoadingRef,
    onDelete: () => {
      setCId("");
      setSateConversation(null);
    },
  };

  useEffect(() => {
    if (!cId.trim()) return;

    getConversationSettings({ conversationId: cId }).then((res) => {
      if (res.success && res.conversation) {
        setSateConversation(res.conversation);
      }
    });
  }, [cId]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext outside provider.");
  return ctx;
}
