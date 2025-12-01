"use client";
import { RoomPageProps } from "@/app/types/props";
import Loading from "@/components/ui/loading/Loading";
import { db } from "@/configs/firebase";
import { FireStoreRooms } from "@/types/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import React, { use, useEffect, useState } from "react";

export default function RoomStartPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const roomRef = doc(db, "rooms", roomId);
  const [room, setRoom] = useState<FireStoreRooms | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(roomRef, (snapshot) => {
      setRoom(snapshot.data() as FireStoreRooms);
    });
    setLoading(false);

    return () => unsub();
  }, []);

  if (loading) return <Loading />;
  if (!room)
    return (
      <div className="p-8 text-grey-70">
        <p>Room can't be found or you dont have permision</p>
      </div>
    );
  return <div></div>;
}
