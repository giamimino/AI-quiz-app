"use client";
import {
  ChatsContainer,
  FriendRequestsWrapper,
  FriendWrapper,
  SettingsButton,
  SettingsWrapper,
} from "@/components/templates/chat-components";
import DefaultButton from "@/components/ui/default/default-button";
import DefaultTitle from "@/components/ui/default/default-title";
import { useDebounce } from "@/hooks/useDebounce";
import {
  handleCheckFriendRequests,
  handleGetConversationParticants,
  handleGetFriends,
  responseFriendRequest,
} from "@/lib/actions/actions";
import { socket } from "@/lib/socketClient";
import { useUserStore } from "@/zustand/useUserStore";
import { Icon } from "@iconify/react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  FriendConversationParticant,
  FriendRequestsType,
  FriendType,
} from "../types/connections";
import { useSettings } from "@/context/SettingsContext";
import { AnimatePresence } from "framer-motion";
import Title from "@/components/ui/default/title";
import { timeAgo } from "@/utils/timeAgo";
import Loading from "@/components/ui/loading/Loading";

export default function MessagesPage() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);
  const [friends, setFriends] = useState<FriendConversationParticant[]>([]);
  const { user } = useUserStore();
  const { open, structure, cache, setCache, clearCache } = useSettings();

  const loaders = {
    requests: () =>
      handleCheckFriendRequests({ userId: user?.id }).then((res) => {
        if (res.success && res.friendRequests) {
          setCache([...res.friendRequests.friendRequestsReceived], "requests");
        }
      }),

    friends: () =>
      handleGetFriends({ userId: user?.id }).then((res) => {
        if (res.success && res.friends) {
          setCache([...res.friends], "friends");
        }
      }),
  };

  const handleResponseFriendRequest = async (
    status: "accept" | "reject",
    requesterId: string,
    requestId: string
  ) => {
    try {
      const res = await responseFriendRequest({
        status,
        requestId,
        requesterId,
        receiverId: user?.id,
      });

      if (res.success) {
        clearCache("requests");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!open.isOpen) return;

    if (!cache?.[open.type]) {
      loaders[open.type]?.();
    }
  }, [open]);

  useEffect(() => {
    handleGetConversationParticants({ userId: user?.id }).then((res) => {
      if (res.success && res.conversationParticipant) {
        setFriends((prev) => [...(prev ?? []), ...res.conversationParticipant]);
      }
    });
  }, []);

  return (
    <div className="p-8">
      <SettingsWrapper>
        <Title>{structure.title}</Title>
        {cache &&
          cache[open.type]?.map((c: any) =>
            open.type === "friends" ? (
              <FriendWrapper
                key={c.id}
                name={c.friend.name}
                image={c.friend.image}
                onClick={() => console.log("Clicked!")}
              />
            ) : (
              <FriendRequestsWrapper
                key={c.id}
                username={c.requester.username}
                image={c.requester.image}
                joined={timeAgo(c.createdAt as Date)}
                handleResponse={(status) =>
                  handleResponseFriendRequest(status, c.requester.id, c.id)
                }
              />
            )
          )}
      </SettingsWrapper>
      <ChatsContainer>
        <div className="flex justify-between">
          <DefaultTitle title="Chats" font="600" text={20} />
          <div className="flex gap-2.5">
            <SettingsButton icon="formkit:people" type="friends" />
            <SettingsButton
              type="requests"
              icon="fluent-mdl2:add-friend"
              count={0}
            />
          </div>
        </div>
        <div className="flex justify-center items-center rounded-2xl min-h-8 outline-none border border-amber-50 text-white">
          <label
            htmlFor="messagesPage_search_input_01"
            className="text-grey-70 cursor-pointer px-3"
          >
            <Icon icon={"mage:search"} />
          </label>
          <input
            id="messagesPage_search_input_01"
            value={searchValue}
            onChange={(change) => setSearchValue(change.target.value)}
            className="text-white outline-none pr-3 py-1.5"
            placeholder="Search chats..."
          />
        </div>
        <div className="flex flex-col gap-2.5">
          {friends.length !== 0 ? (
            friends.map((f) => (
              <FriendWrapper
                key={`${f.id}-${f.user.id}-${user?.id}`}
                name={f.user.name}
                image={f.user.image}
                onClick={() => {}}
              />
            ))
          ) : (
            <p className="text-white text-center">No conversation found.</p>
          )}
        </div>
      </ChatsContainer>
    </div>
  );
}
