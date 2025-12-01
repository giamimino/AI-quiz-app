"use client";
import { RoomPageProps } from "@/app/types/props";
import UnderlineButton from "@/components/ui/buttons/underline-button";
import DefaultTitle from "@/components/ui/default/default-title";
import DefaultWrapper from "@/components/ui/default/default-wrapper";
import Loading from "@/components/ui/loading/Loading";
import { db } from "@/configs/firebase";
import { FireStoreRooms } from "@/types/firestore";
import { useUserStore } from "@/zustand/useUserStore";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import months from "@/data/months.json";
import CountUpTimer from "@/utils/CountUpTimer";
import { leaveRoom } from "@/lib/actions/actions";
import { useUserRoomStatusStore } from "@/zustand/useUserRoomStatusStore";

export default function RoomPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const { user, setUser } = useUserStore();
  const { status, clearStatus } = useUserRoomStatusStore()
  const roomRef = doc(db, "rooms", roomId);
  const router = useRouter();
  const [room, setRoom] = useState<FireStoreRooms | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<string[]>([])

  const handleLeaveRoom = async () => {
    try {
      if(!user) return
      const result = await leaveRoom({ userId: user.id, roomId })

      setMessages(prev => [...prev, result.message])
      if(result.success) {
        clearStatus()
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const unsub = onSnapshot(roomRef, (snapshot) => {
      setRoom(snapshot.data() as FireStoreRooms);
    });
    setLoading(false)
    
    return () => unsub();
  }, []);
  
  useEffect(() => {
    if (user) return;
    setLoading(true)
    fetch("/api/user/get")
    .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if(!room || !user) return
    if(!room.players.some(p => p.id === user.id)) {
      clearStatus( )
      router.push("/games")
    }
  }, [room, user])
  

  if (loading) return <Loading />;
  if (!room)
    return (
      <div className="p-8 text-grey-70">
        <p>Room can't be found or you dont have permision</p>
      </div>
    );

  return (
    <div className="p-8">
      <DefaultWrapper p={{ p: 3.5 }} solid col gap={1} rel>
        <DefaultTitle title={room.title as string} text={26} font="600" />
        <div className="flex gap-2.5 text-grey-70">
          <h1>#{room.topic}</h1>
          <p>questions: {room.questions_length}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <DefaultTitle title="Players List" text={24} font="500" />
          <DefaultWrapper p={{ p: 2.5 }}>
            {room.players.map((p) => (
              <div
                key={p.id}
                className="w-full flex justify-between items-center"
              >
                <DefaultTitle title={p.name} text={18} />
                {p.id !== user?.id ? (
                  <div className="flex items-center gap-2.5">
                    <UnderlineButton
                      label="view profile"
                      onClick={() =>
                        router.push(`/profile/${p.username}?id=${p.id}`)
                      }
                    />
                  </div>
                ) : (
                  <UnderlineButton label="You" />
                )}
              </div>
            ))}
          </DefaultWrapper>
        </div>
        <p className="text-grey-80">
          players limit {room.players.length}/{room.players_limit}
        </p>
        <p className="text-grey-80">
          created by - {room.players.find((p) => p.id === room.createdBy)?.name}
        </p>
        <CountUpTimer />
        <button onClick={handleLeaveRoom} className="w-fit absolute right-2.5 bottom-2.5 p-2.5 border border-red-500 bg-red-500/40 rounded-lg text-grey-70 cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-500">
          Leave Room
        </button>
      </DefaultWrapper>
    </div>
  );
}
