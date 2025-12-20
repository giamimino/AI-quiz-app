"use client";
import {
  ChatsContainer,
  ConversationContainer,
  ConversationParticipants,
  FriendRequestsWrapper,
  FriendWrapper,
  SettingsButton,
  SettingsWrapper,
} from "@/components/templates/chat-components";
import DefaultTitle from "@/components/ui/default/default-title";
import { useDebounce } from "@/hooks/useDebounce";
import {
  deleteConversation,
  getConversationMessages,
  handleCheckFriendRequests,
  handleGetConversationParticants,
  handleGetFriends,
  removeFriend,
  responseFriendRequest,
  sendMessage,
} from "@/lib/actions/actions";
import { socket } from "@/lib/socketClient";
import { useUserStore } from "@/zustand/useUserStore";
import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Conversation,
} from "../types/connections";
import { useSettings } from "@/context/SettingsContext";
import {
  animate,
  AnimatePresence,
  motion,
} from "framer-motion";
import Title from "@/components/ui/default/title";
import { timeAgo } from "@/utils/timeAgo";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Error from "@/components/ui/error";
import { FRIEND_REMOVE_SUCCESS, GENERIC_ERROR } from "@/constants/errors";
import { useChatContext } from "@/context/ChatContext";
import SettingsChatsLoading from "@/components/ui/loading/SettingsChatsLoading";
import cuid from "cuid";
import Image from "next/image";
import { fetchMessages } from "@/utils/fetchMessages";
import months from "@/data/months.json";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);
  console.log(debouncedSearchValue);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<
    {
      text: string;
      sender: { id: string; name: string };
      id: string;
      createdAt: Date;
    }[]
  >([]);
  const [errors, setErrors] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const { open, structure, cache, setCache, clearCache, loadingRef, close } =
    useSettings();
  const {
    conversationId,
    conversation,
    setConversationId,
    chatsLoadingRef,
    onDelete,
  } = useChatContext();
  const reachedRef = useRef(false);
  const isMessagesAtEnd = useRef<boolean>(true);
  const router = useRouter()

  const handleScroll = async () => {
    if (!chatRef.current) return;

    const scrollTop = chatRef.current.scrollTop;
    const targetHeight = 200;

    if (
      scrollTop <= targetHeight &&
      !reachedRef.current &&
      !isMessagesAtEnd.current
    ) {
      reachedRef.current = true;
      let accDate = new Date().getTime();
      for (let i = 0; i < messages.length; i++) {
        const createdAt = messages[i]?.createdAt;
        if (!createdAt) continue;

        const time = new Date(createdAt).getTime();

        if (!isNaN(time) && time < accDate) {
          accDate = time;
        }
      }
      const oldestMessageId =
        messages.find((m) => new Date(m.createdAt).getTime() === accDate)?.id ??
        "";
      const res = await fetchMessages({
        url: "/api/user/get/conversation/messages",
        conversationId,
        oldestMessageId,
      });
      if (res.success) {
        if (!res.hasMore) {
          isMessagesAtEnd.current = true;
        }
        if (res.messages) {
          handleScrollBy({ y: 220 });
          setMessages((prev) => [...res.messages, ...prev]);
        }
      }
    }

    if (scrollTop > targetHeight && reachedRef.current) {
      reachedRef.current = false;
    }
  };

  const scrollToBottom = () => {
    if (!chatRef.current) return;

    const start = chatRef.current.scrollTop;
    const end = chatRef.current.scrollHeight;

    animate(start, end, {
      duration: 0.7,
      ease: "easeInOut",
      onUpdate(value) {
        if (chatRef.current) chatRef.current.scrollTop = value;
      },
    });
  };

  const handleScrollBy = ({ y }: { y?: number }) => {
    if (!chatRef.current) return;

    const start = chatRef.current.scrollTop;
    const end = start + (y ?? 200);

    animate(start, end, {
      duration: 0.7,
      ease: "easeInOut",
      onUpdate(value) {
        if (chatRef.current) chatRef.current.scrollTop = value;
      },
    });
  };

  const loaders = {
    friends: async () => {
      loadingRef.current.friends = true;
      const res = await handleGetFriends({ userId: user?.id });
      loadingRef.current.friends = false;

      if (res.success && res.friends) {
        setCache(res.friends, "friends");
      }
    },

    requests: async () => {
      loadingRef.current.requests = true;
      const res = await handleCheckFriendRequests({ userId: user?.id });
      loadingRef.current.requests = false;

      if (res.success && res.friendRequests) {
        setCache(res.friendRequests.friendRequestsReceived, "requests");
      }
    },
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
      } else {
        setErrors((prev) => [...prev, res.message ?? GENERIC_ERROR]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const res = await removeFriend({ friendId });

      if (res?.success) {
        setErrors((prev) => [...prev, FRIEND_REMOVE_SUCCESS]);
      } else {
        setErrors((prev) => [...prev, res?.message ?? GENERIC_ERROR]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenConversation = async (id: string) => {
    try {
      const res = await getConversationMessages({ conversationId: id });
      if (!res.success) return;
      if (res.messages) {
        setMessages(res.messages ?? []);
      }
      setConversationId(id);
      const room = `conversation:${id}`;
      socket.emit("join-room", { room, username: user?.username });

      setTimeout(() => scrollToBottom(), 100);
      messageInputRef.current?.focus();
      setTimeout(() => (isMessagesAtEnd.current = false), 400);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartNewConversation = async (friendId: string) => {
    try {
      const res = await fetch("/api/user/post/friend/conversation/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, friendId }),
      });
      const data = await res.json();

      if (data.success) {
        setConversations((prev) => [data.conversation, ...prev]);
        setErrors((prev) => [...prev, "started new conversation."]);
      } else {
        setErrors((prev) => [...prev, data.message]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (message?: string) => {
    try {
      if (!message || !user) return;

      const id = cuid();
      const createdAt = new Date();

      setMessages((prev) => [
        ...prev,
        {
          text: message,
          sender: { id: user.id, name: user.name },
          id,
          createdAt,
        },
      ]);

      const res = await sendMessage({
        conversationId,
        senderId: user.id,
        text: message,
        id,
        createdAt,
      });

      if (!res.success || !res.resMessage) {
        setMessages((prev) => prev.filter((p) => p.id !== id));
        return;
      }
      const room = `conversation:${conversationId}`;
      socket.emit("message", {
        room,
        id,
        message,
        sender: { id: user.id, name: user.name },
      });
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  };

  const renderParticipantConversationHeader = () => {
    const participant = participants.find(
      (p) => p.conversationId === conversationId
    );

    if (!participant) return null;

    return (
      <div className="flex gap-2.5">
        <Image
          src={participant.user.image ?? ""}
          alt="profile"
          width={48}
          height={48}
          className="rounded-xl"
        />
        <div>
          <h1>{participant.user.name}</h1>
        </div>
      </div>
    );
  };

  const handleDeleteConversation = async () => {
    try {
      await deleteConversation({ conversationId });
      setConversations((prev) => prev.filter((p) => p.id !== conversationId));
      onDelete();
      close();
    } catch (error) {
      console.error(error);
    }
  };

  const participants = useMemo(() => {
    if (!user?.id) return [];
    return conversations
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .flatMap((c) => {
        const p = c.participants.find((p: any) => p.userId !== user.id);
        if (!p) return [];
        return [{ ...p, lastMessage: c.lastMessage?.text }];
      });
  }, [conversations, user?.id]);

  useEffect(() => {
    if (!socket || !user?.id) return;

    socket.on("message", (data) => {
      setMessages((prev) => [...(prev ?? []), { ...data, text: data.message }]);
      scrollToBottom();
    });

    return () => {
      socket.off("message");
    };
  }, [socket, user?.id]);

  useEffect(() => {
    if (!open.isOpen) return;

    if (!cache?.[open.type] && open.type !== "settings") {
      loaders[open.type]?.();
    }

    if (open.type === "settings") {
      loadingRef.current.settings = false;
    }
  }, [open.isOpen, open.type]);

  useEffect(() => {
    chatsLoadingRef.current = true;
    handleGetConversationParticants({ userId: user?.id }).then((res) => {
      chatsLoadingRef.current = false;
      if (res.success && res.particants) {
        setConversations(res.particants);
      }
    });
  }, []);

  return (
    <div className="p-8">
      <AnimatePresence>
        {errors.length > 0 && (
          <ErrorsWrapper>
            {errors.map((c, idx) => (
              <Error
                key={`${c}-${idx}-error`}
                error={`${c} 0${idx}`}
                handleClose={() => setErrors((prev) => prev.splice(idx, 1))}
              />
            ))}
          </ErrorsWrapper>
        )}
      </AnimatePresence>
      <SettingsWrapper>
        <Title>{structure.title}</Title>
        {loadingRef.current[open.type] && <SettingsChatsLoading />}
        {!loadingRef.current[open.type] &&
          cache &&
          cache[open.type]?.map((c: any) =>
            open.type === "friends" ? (
              <FriendWrapper
                key={c.id}
                name={c.friend.name}
                image={c.friend.image}
                handleStartNewConversation={() =>
                  handleStartNewConversation(c.friend.id)
                }
                handleDeleteFriend={() => handleRemoveFriend(c.id)}
                redirectProfile={() => router.push(`/profile/${c.friend.username}?id=${c.friend.id}`)}
              />
            ) : open.type === "requests" ? (
              <FriendRequestsWrapper
                key={c.id}
                username={c.requester.username}
                image={c.requester.image}
                joined={timeAgo(c.createdAt as Date)}
                handleResponse={(status) =>
                  handleResponseFriendRequest(status, c.requester.id, c.id)
                }
              />
            ) : null
          )}

        {open.type === "friends" && cache?.friends?.length === 0 && (
          <p>You don’t have any friends yet.</p>
        )}

        {open.type === "requests" && cache?.requests?.length === 0 && (
          <p>No friend requests found.</p>
        )}

        {open.type === "settings" && (
          <div>
            <div>
              <p className="flex gap-1">
                <span className="text-grey-80 font-medium">Messages sent:</span>
                <span className="text-grey-70">
                  {conversation?._count.messages &&
                    `${conversation._count.messages}`}
                </span>
              </p>
              <p className="flex gap-1">
                <span className="text-grey-80 font-medium">Creation date:</span>
                <span className="text-grey-70">
                  {conversation?.createdAt &&
                    `${conversation.createdAt.getDate()} ${
                      months[conversation.createdAt.getMonth()]
                    } ${conversation.createdAt.getFullYear()}`}
                </span>
              </p>
              <p className="flex gap-1">
                <span className="text-grey-80 font-medium">
                  Lastest message sent on:
                </span>
                <span className="text-grey-70">
                  {conversation?.updatedAt &&
                    `${conversation.updatedAt.getDate()} ${
                      months[conversation.updatedAt.getMonth()]
                    } ${conversation.updatedAt.getFullYear()}`}
                </span>
              </p>
            </div>
            <div className="flex gap-2.5">
              <p>Do you want delete conversation?</p>
              <button
                className="rounded-lg text-red-600 font-bold 
              flex justify-center items-center text-lg cursor-pointer"
                onClick={handleDeleteConversation}
              >
                <Icon icon={"basil:trash-solid"} />
              </button>
            </div>
          </div>
        )}
      </SettingsWrapper>
      <div className="flex gap-5 max-md:flex-col">
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
              className="text-white outline-none pr-3 py-1.5 w-full"
              placeholder="Search chats..."
            />
          </div>
          <div className="flex flex-col gap-2.5">
            {chatsLoadingRef.current && <SettingsChatsLoading />}
            {!chatsLoadingRef.current &&
              participants?.map((p) => (
                <ConversationParticipants
                  key={`${p.id}-${p.user.id}-c`}
                  name={p.user.name}
                  image={p.user.image}
                  lastMessage={p.lastMessage}
                  onClick={() => handleOpenConversation(p.conversationId)}
                  selected={p.conversationId === conversationId}
                />
              ))}
          </div>
        </ChatsContainer>
        <ConversationContainer>
          <div className="flex flex-col pt-0 p-3.5 w-full h-full overflow-hidden rounded-2xl bg-dark-12 dark-15-shadow text-white">
            <div className="py-2.5 w-full border-b border-b-grey-70 flex justify-between items-center">
              {renderParticipantConversationHeader()}
              <SettingsButton icon="solar:settings-bold" type="settings" />
            </div>
            <motion.div
              ref={chatRef}
              className="max-h-100 overflow-y-scroll flex flex-col gap-2.5"
              onScroll={handleScroll}
            >
              {!isMessagesAtEnd.current && <SettingsChatsLoading />}
              {isMessagesAtEnd.current && (
                <p className="text-grey-70 text-center p-2">
                  {`You've`} reached at the end
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={`message-${m.id}-sender-${m.sender.id}`}
                  className={`${
                    m.sender.id === user?.id ? "self-end" : "self-start"
                  } p-2 border border-grey-70 rounded-lg w-fit max-w-7/10`}
                >
                  <p className="border-b border-grey-70 pb-1">
                    {m.sender.name}
                  </p>
                  <h1 className="pt-1.5">{m.text}</h1>
                </div>
              ))}
            </motion.div>
            <div className="flex gap-2 pt-2.5">
              <input
                ref={messageInputRef}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    messageInputRef.current &&
                    messageInputRef.current.value.trim()
                  ) {
                    handleSendMessage(messageInputRef.current.value);
                    messageInputRef.current.value = "";
                  }
                }}
                className="border border-white rounded-lg w-full px-1.5 py-px"
              />
              <button
                className="p-1 border border-white rounded-lg cursor-pointer"
                onClick={() => {
                  if (
                    messageInputRef.current &&
                    messageInputRef.current.value.trim()
                  ) {
                    handleSendMessage(messageInputRef.current.value);
                    messageInputRef.current.value = "";
                  }
                }}
              >
                <Icon icon={"mingcute:send-line"} />
              </button>
            </div>
          </div>
        </ConversationContainer>
      </div>
    </div>
  );
}
