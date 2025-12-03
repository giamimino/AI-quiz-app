"use client";
import { RoomPageProps } from "@/app/types/props";
import PlayersWelcome from "@/components/ui/animations/players-welcome";
import QuestionsGenerating from "@/components/ui/animations/questions-generating";
import Loading from "@/components/ui/loading/Loading";
import { db } from "@/configs/firebase";
import { GENERIC_ERROR } from "@/constants/errors";
import {
  handleStartQuestionsGenerate,
  handleUpdateQuestionsInRoom,
} from "@/lib/actions/actions";
import { FireStoreRooms } from "@/types/firestore";
import { useUserStore } from "@/zustand/useUserStore";
import cuid from "cuid";
import { doc, onSnapshot } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

export default function RoomStartPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const roomRef = doc(db, "rooms", roomId);
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [room, setRoom] = useState<FireStoreRooms | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [start, setStart] = useState(false);

  console.log("start", start);
  

  function MapRoomPlayers(): {
    [key: string]: { name: string; thumb: string };
  } {
    if (!room || !user)
      return {
        pl1: {
          name: "saba",
          thumb: "https://cdn.discordapp.com/embed/avatars/0.png",
        },
      };

    let result: { [key: string]: { name: string; thumb: string } } = {};

    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].id !== user.id) {
        const key = `pl${i + 1}`;
        result[key] = {
          name: room.players[i].name,
          thumb: room.players[i].image,
        };
      }
    }

    return result;
  }

  useEffect(() => {
    const unsub = onSnapshot(roomRef, (snapshot) => {
      setRoom({ ...snapshot.data(), id: snapshot.id } as FireStoreRooms);
    });
    setLoading(false);

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!room || !user) return;

    if (
      room.players.length > room.players_limit ||
      !room.players.some((p) => p.id === user.id) ||
      !room.start
    ) {
      router.push("/games");
    } else {
      setStart(true);
      if (room.questions) return;
      handleStartQuestionsGenerate({ userId: user.id, roomId: roomId })
        .then((res) => {
          console.log(res);

          if (res.success) {
          }
          if (res.message) {
            setMessages((prev) => [...prev, res.message]);
          }
        })
        .catch((err) => console.error(err));
      fetch("/api/ai/generate/questions/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: room.topic,
          length: room.questions_length,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const content =
              data.aiResponse?.choices?.[0]?.message?.content ||
              data.aiResponse?.result?.output_text ||
              "[]";

            const cleaned = content
              .replace(/```json/g, "")
              .replace(/```/g, "")
              .trim();

            try {
              const parsed = JSON.parse(cleaned);

              const editedParsed = Array.isArray(parsed)
                ? (parsed.map((q) => ({
                    ...q,
                    id: cuid(),
                  })) as {
                    question: string;
                    options: string[];
                    answer: string;
                    id: string;
                  }[])
                : [];

              handleUpdateQuestionsInRoom({
                userId: user.id,
                roomId: room.id,
                questions: editedParsed,
              })
                .then((res) => {
                  console.log(res);

                  setMessages((prev) => [
                    ...prev,
                    res?.message ?? GENERIC_ERROR,
                  ]);
                })
                .catch((err) => console.error(err));
              setGenerating(false);
            } catch (error) {
              console.error(error);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [room, user]);

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

  console.log(generating);
  

  useEffect(() => {
    if (!room) return;
    setGenerating(room.questions_generate_status);
  }, [room]);

  if (loading) return <Loading />;
  if (!room || !user)
    return (
      <div className="p-8 text-grey-70">
        <p>Room can't be found or you dont have permision.</p>
      </div>
    );
  if (start)
    return (
      <PlayersWelcome
      handleStop={() => setStart(false)}
        thisPl={{ name: user.name, thumb: user.image }}
        players={MapRoomPlayers()}
      />
    );

  return (
    <div>
      {generating && !start && (
        <AnimatePresence>
          <QuestionsGenerating />;
        </AnimatePresence>
      )}
    </div>
  );
}
