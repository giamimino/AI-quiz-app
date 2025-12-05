"use client";
import { RoomPageProps } from "@/app/types/props";
import WinnerGreet from "@/components/ui/animations/winner-greet";
import DefaultTitle from "@/components/ui/default/default-title";
import Loading from "@/components/ui/loading/Loading";
import { db } from "@/configs/firebase";
import { FireStoreRooms } from "@/types/firestore";
import { useUserStore } from "@/zustand/useUserStore";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

export default function RoomGameResultPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const { user, setUser } = useUserStore();
  const roomRef = doc(db, "rooms", roomId);
  const [room, setRoom] = useState<FireStoreRooms | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false)
  const router = useRouter();

  function MapRoomPlayers(): {
    [key: string]: { name: string; image: string; id: string };
  } {
    if (!room || !user)
      return {
        pl1: {
          name: "saba",
          image: "https://cdn.discordapp.com/embed/avatars/0.png",
          id: "1",
        },
      };

    let result: { [key: string]: { name: string; image: string; id: string } } =
      {};

    for (let i = 0; i < room.players.length; i++) {
      const key = `pl${i + 1}`;
      result[key] = {
        name: room.players[i].name,
        image: room.players[i].image,
        id: room.players[i].id,
      };
    }

    return result;
  }

  function FindWinner(): string {
    if (!room || !user) return "1";
    const players = room.players;
    let accPlayer: any = { score: 0 };
    for (const player of players) {
      if (Number(player.score) > accPlayer.score) {
        accPlayer = { id: player.id, score: player.score };
      }
    }

    return accPlayer.id as string;
  }

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await getDoc(roomRef);
      if (!snap.exists()) {
        router.push("/games");
        return;
      }

      const data = snap.data() as FireStoreRooms;

      if (
        !data.players.some((p) => p.id === user.id) ||
        !data.start ||
        data.status !== "ending" ||
        data.players.length > data.players_limit ||
        !data.players.some((p) => p.finished)
      ) {
        router.push("/games");
        return;
      }

      setRoom(data);
    })();
  }, [user]);

  console.log(room);

  useEffect(() => {
    if (user) return;
    setLoading(true);
    fetch("/api/user/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
        setLoading(false);
      });
  }, []);
  if (loading) return <Loading />;
  if (!room || !user)
    return (
      <div className="p-8 text-grey-70">
        <p>Room can't be found or you dont have permision.</p>
      </div>
    );
  return (
    <div>
      <WinnerGreet winner={FindWinner()} players={MapRoomPlayers()} onEnd={() => setInitialized(true)} />
      {initialized && (
        <div className="w-full">
          <div className="w-full flex justify-center">
            <DefaultTitle title="Players" text={20} font="700" />
          </div>
        </div>
      )}
    </div>
  );
}
