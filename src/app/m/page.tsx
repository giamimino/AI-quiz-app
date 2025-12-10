"use client";
import { ChatsContainer } from "@/components/templates/chat-components";
import DefaultTitle from "@/components/ui/default/default-title";
import { Icon } from "@iconify/react";
import React from "react";

export default function MessagesPage() {
  return (
    <div className="p-8">
      <ChatsContainer>
        <DefaultTitle title="Chats" font="600" text={20} />
        <div className="flex justify-center items-center rounded-2xl min-h-8 outline-none border border-amber-50 text-white">
          <label htmlFor="messagesPage_search_input_01" className="text-grey-70 cursor-pointer px-3">
            <Icon icon={"mage:search"} />
          </label>
          <input
            id="messagesPage_search_input_01"
            value={""}
            onChange={(change) => console.log(change.target.value)}
            className="text-white outline-none pr-3 py-1.5"
            placeholder="Search chats..."
          />
        </div>
      </ChatsContainer>
    </div>
  );
}
