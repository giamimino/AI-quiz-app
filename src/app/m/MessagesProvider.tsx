"use client";

import { SettingsProvider } from "@/context/SettingsContext";
import { ChatProvider } from "@/context/ChatContext";

export function MessagesProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </SettingsProvider>
  );
}
