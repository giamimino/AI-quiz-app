"use client";

import { MessagesProviders } from "./MessagesProvider";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagesProviders>{children}</MessagesProviders>;
}
