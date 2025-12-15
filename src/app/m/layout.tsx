"use client";

import { SettingsProvider } from "@/context/SettingsContext";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsProvider>{children}</SettingsProvider>;
}
