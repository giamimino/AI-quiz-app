"use client";
import { UserRoomStatus } from "@/app/types/store";
import UnderlineButton from "@/components/ui/buttons/underline-button";
import DefaultButton from "@/components/ui/default/default-button";
import DefaultTitle from "@/components/ui/default/default-title";
import DefaultWrapper from "@/components/ui/default/default-wrapper";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import { db } from "@/configs/firebase";
import { GENERIC_ERROR } from "@/constants/errors";
import {
  blockUser,
  CreateRoom,
  deleteRoom,
  joinRoom,
  kickPlayer,
} from "@/lib/actions/actions";
import { FireStoreRooms } from "@/types/firestore";
import { useUserRoomStatusStore } from "@/zustand/useUserRoomStatusStore";
import { useUserStore } from "@/zustand/useUserStore";
import clsx from "clsx";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function QuickClashPage() {
  const { user, setUser } = useUserStore();
  const { status, setStatus, clearStatus } = useUserRoomStatusStore();
  const [rooms, setRooms] = useState<FireStoreRooms[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const router = useRouter();
  const roomsRef = collection(db, "rooms");

  const FetchRooms = async () => {
    try {
      const data = await getDocs(roomsRef);
      let result: any[] = [];
      data.forEach((doc) => {
        if (!rooms.some((room) => room.id === doc.id)) {
          result.push({ ...doc.data(), id: doc.id });
        }
      });
      setRooms((prev) => [...prev, ...result]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitRooms = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const result = await CreateRoom({
        formData,
        isPublic,
        ...(user
          ? {
              user: { ...user },
            }
          : {}),
        status,
      });

      if (result?.success) {
        setRoomId(result.roomId as string);
      } else {
        setMessages((prev) => [...prev, result.message ?? GENERIC_ERROR]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveRoom = async () => {
    try {
      if (!roomId) return;
      const result = await deleteRoom({ userId: user?.id, roomId });

      setMessages((prev) => [...prev, result.message]);
      if (result.success) {
        setRooms((prev) => prev.filter((p) => p.id !== result.roomId));
        clearStatus();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinInRoom = async (guestRoomId: string) => {
    try {
      if (!user) return;
      const result = await joinRoom({
        user: { name: user.name, username: user.username, id: user.id },
        roomId: guestRoomId,
        status,
      });

      setMessages((prev) => [...prev, result.message]);
      if (result.success) {
        setStatus(result.status as UserRoomStatus);
        router.push(`quickclash/room/${result.roomId}`)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      if(!roomId) return
      const result = await blockUser({ userId, roomId })

      setMessages(prev => [...prev, result.message])
    } catch (error) {
      console.error(error); 
    }
  }

  const handleKickPLayerFromRoom = async (userId: string) => {
    try {
      if (!roomId) return;

      const result = await kickPlayer({ userId, roomId });

      if (result) {
        setMessages((prev) => [...prev, result.message]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const myroom = useMemo(() => {
    if (!rooms || !user) return null;
    let result = null;
    if (rooms.some((r) => r.createdBy === user.id)) {
      const my = rooms.find((r) => r.createdBy === user.id);
      result = my;
      setRoomId(my?.id as string);
    }

    return result;
  }, [rooms, user]);

  useEffect(() => {
    onSnapshot(roomsRef, (snapshot) => {
      const result: any[] = [];
      console.log(snapshot);
      
      snapshot.forEach((doc) => {
        if (!rooms.some((room) => room.id === doc.id)) {
          result.push({ ...doc.data(), id: doc.id });
        }
      });
      setRooms(result);
    });
  }, []);

  useEffect(() => {
    if (user) return;
    fetch("/api/user/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      });
  }, []);

  useEffect(() => {
    if (!rooms || !user || status) return;
    let findUser = null;
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].players.some((p) => p.id === user.id) && !findUser) {
        findUser = {
          ...rooms[i].players.find((p) => p.id === user.id),
          roomId: rooms[i].id,
        };
      }
    }

    if (
      findUser &&
      typeof findUser.id !== "undefined" &&
      typeof findUser.name !== "undefined" &&
      typeof findUser.username !== "undefined"
    ) {
      setStatus(findUser as UserRoomStatus);
    }
  }, [user, rooms]);

  return (
    <div className="p-8 flex flex-col gap-4">
      <AnimatePresence>
        {messages.length > 0 && (
          <ErrorsWrapper>
            {messages.map((c, idx) => (
              <Error
                key={`${c}-${idx}-error`}
                error={`${c} 0${idx}`}
                handleClose={() => setMessages((prev) => prev.splice(idx, 1))}
              />
            ))}
          </ErrorsWrapper>
        )}
      </AnimatePresence>
      <div>
        <DefaultTitle title="Create Room" text={22} font="600" />
        <form
          className="border border-dark-15 p-4 rounded-lg flex flex-wrap gap-2.5 w-fit max-w-1/2"
          onSubmit={handleSubmitRooms}
        >
          <div className="flex flex-col gap-px">
            <label className="text-grey-70" htmlFor="title_input_game_page">
              Title
            </label>
            <input
              className="border border-white rounded-md text-white py-1 px-2"
              type="text"
              id="title_input_game_page"
              defaultValue={`${user?.name}'s room`}
              required
              name="title"
            />
          </div>
          <div className="flex flex-col gap-px">
            <label className="text-grey-70" htmlFor="topic_input_game_page">
              Topic
            </label>
            <input
              className="border border-white rounded-md text-white py-1 px-2"
              type="text"
              id="topic_input_game_page"
              required
              name="topic"
            />
          </div>
          <div className="flex flex-nowrap w-full gap-2.5">
            <div className="flex items-center gap-1">
              <label
                htmlFor="public_checkbox_game_page"
                className="text-grey-70"
              >
                public
              </label>
              <button
                type="button"
                className={clsx(
                  "border border-white p-1.5 rounded-sm cursor-pointer transition-all duration-500",
                  isPublic ? "bg-white" : "bg-transparent"
                )}
                onClick={() => setIsPublic((prev) => !prev)}
              ></button>
            </div>
            <div className="flex items-center gap-1">
              <label
                htmlFor="players_limit_number_game_page"
                className="text-grey-70 "
              >
                Limit
              </label>
              <input
                type="number"
                className="border custom-number border-white rounded-md text-white py-1 px-1.5 max-w-10 text-center"
                min={1}
                max={6}
                id="players_limit_number_game_page"
                required
                name="players_limit"
              />
            </div>
            <div className="flex items-center gap-1">
              <label
                htmlFor="questions_limit_number_game_page"
                className="text-grey-70 "
              >
                Questions
              </label>
              <input
                type="number"
                className="border custom-number border-white rounded-md text-white py-1 px-1.5 max-w-10 text-center"
                min={1}
                max={25}
                id="questions_limit_number_game_page"
                required
                name="questions_length"
              />
            </div>
          </div>
          <DefaultButton label="Create" type="submit" />
        </form>
      </div>
      <DefaultWrapper p={{ p: 4.5 }} col gap={2.5}>
        <div className="w-full flex justify-between">
          <DefaultTitle title="Rooms" text={21} font="600" />
          <span></span>
          <DefaultButton icon="material-symbols:refresh" onClick={FetchRooms} />
        </div>
        <DefaultWrapper dFlex flexWrap gap={3.5} noBorder>
          {rooms.map((room) => (
            <DefaultWrapper key={room.id} col wFit p={{ px: 3, py: 2 }} solid>
              <DefaultTitle title={room.title} text={17} font="500" />
              <div className="flex gap-2.5 items-center">
                <DefaultTitle
                  title={`${room.players.length ?? "0"}/${room.players_limit}`}
                />
                {room.createdBy !== user?.id && (
                  <DefaultButton
                    onClick={() => handleJoinInRoom(room.id)}
                    icon="streamline:user-add-plus-solid"
                    small
                  />
                )}
              </div>
            </DefaultWrapper>
          ))}
        </DefaultWrapper>
      </DefaultWrapper>

      {myroom !== null && (
        <DefaultWrapper p={{ p: 4.5 }} col gap={2.5}>
          <DefaultTitle title="My Room" text={21} font="600" />
          <div className="flex flex-col gap-2.5">
            <DefaultTitle title="Players List" />
            <DefaultWrapper p={{ p: 2.5 }}>
              {myroom?.players.map((p) => (
                <div
                  key={p.id}
                  className="w-full flex justify-between items-center"
                >
                  <DefaultTitle title={p.name} />
                  {p.id !== user?.id ? (
                    <div className="flex items-center gap-2.5">
                      <UnderlineButton
                        label="view profile"
                        onClick={() =>
                          router.push(`/profile/${p.username}?id=${p.id}`)
                        }
                      />
                      <span className="text-orange-600">
                        <UnderlineButton 
                          label="block user"
                          onClick={() => handleBlockUser(p.id)}
                          noTextColor
                        />
                      </span>
                      <span className="text-red-600 hover:text-red-400">
                        <UnderlineButton
                          label="kick"
                          onClick={() => handleKickPLayerFromRoom(p.id)}
                          noTextColor
                        />
                      </span>
                    </div>
                  ) : (
                    <UnderlineButton label="You" />
                  )}
                </div>
              ))}
            </DefaultWrapper>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={handleRemoveRoom}
              className="p-2.5 border border-red-500 bg-red-500/40 rounded-lg text-grey-70 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-500"
            >
              Remove Room
            </button>
            <DefaultButton label="Start" wFit />
          </div>
        </DefaultWrapper>
      )}
    </div>
  );
}
