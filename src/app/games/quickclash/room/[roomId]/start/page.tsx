"use client";
import { RoomPageProps } from "@/app/types/props";
import Quiz from "@/components/quiz/Quiz";
import QuizOption from "@/components/quiz/QuizOption";
import QuizOptions from "@/components/quiz/QuizOptions";
import QuizWrapper from "@/components/quiz/QuizWrapper";
import PlayersWelcome from "@/components/ui/animations/players-welcome";
import QuestionsGenerating from "@/components/ui/animations/questions-generating";
import DefaultButton from "@/components/ui/default/default-button";
import DefaultTitle from "@/components/ui/default/default-title";
import DefaultWrapper from "@/components/ui/default/default-wrapper";
import Loading from "@/components/ui/loading/Loading";
import { db } from "@/configs/firebase";
import {
  handleEndBattle,
  handleUserEndBattle,
  handleStartQuestionsGenerate,
  handleSubmitAnswer,
  handleUpdateQuestionsInRoom,
} from "@/lib/actions/actions";
import { FireStoreRooms } from "@/types/firestore";
import { useUserStore } from "@/zustand/useUserStore";
import cuid from "cuid";
import { doc, onSnapshot } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
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
  const [end, setEnd] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [start, setStart] = useState(false);
  const [pos, setPos] = useState(0);

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

  const handleAnswer = async (answer: { answer: string, isCorrect: boolean }) => {
    try {
      if (!user || !room) return;
      const res = await handleSubmitAnswer({
        userId: user.id,
        roomId,
        answer: { ...answer, questionId: room.questions![pos].id },
        isCorrect: answer.isCorrect
      });

      if (res.success) {
        setPos((prev) => prev + 1);
        console.log(res.message);
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnd = async () => {
    try {
      if (!user || !room) return;
      const res = await handleUserEndBattle({ userId: user.id, roomId });

      if (res.success) {
        console.log("end");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(roomRef, (snapshot) => {
      const newData = { ...snapshot.data(), id: snapshot.id };
      setRoom((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(newData)) {
          return prev;
        }

        return newData as FireStoreRooms;
      });
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
      return;
    }

    if(room.status === "ending") {
      router.push("result")
    }

    if (initialized) return;
    setStart(true);
    const thisPl = room.players.find(p => p.id === user.id)
    if(thisPl?.answers !== null && thisPl) {
      setPos(thisPl.answers.length)
    } 
    setInitialized(true);

    if (room.questions || room.createdBy !== user.id) return;

    handleStartQuestionsGenerate({ userId: user.id, roomId: roomId }).then(
      (res) => {
        if (res.message) {
          setMessages((prev) => [...prev, res.message]);
        }
      }
    );
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
            });

            setInitialized(true);
            setGenerating(false);
          } catch (error) {
            console.error(error);
          }
        }
      });
  }, [room, user]);

  useEffect(() => {
    if (!room) return;
    if(room.status === "ending") {
      handleEndBattle({ roomId }).then(res => {
        if(res.success) {
          console.log("success");
          console.log(res);
        }
      })
    }
  }, [room?.status]);

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
      <main className="flex flex-col gap-10 items-center">
        {room.questions && (
          <>
            <QuizWrapper>
              <span className="flex gap-1">
                <DefaultTitle
                  title={`${pos}/${room.questions_length}`}
                  text={20}
                  font="500"
                />
              </span>
              <Quiz key={room.questions[pos]?.id}>
                {room.questions[pos]?.question}
              </Quiz>
              <QuizOptions>
                {room.questions[pos]?.options.map((op, idx) => (
                  <QuizOption
                    key={`${op}-option-${idx}-id`}
                    option={op}
                    onClick={(option) => handleAnswer({ answer: option, isCorrect: room.questions![pos].answer === option })}
                    selected={false}
                  />
                ))}
              </QuizOptions>
            </QuizWrapper>

            {pos === room.questions_length && room.status !== "ending" && room.status !== "end" && <DefaultButton label="Done" onClick={handleEnd} />}
          </>
        )}
        <DefaultWrapper wFit p={{ p: 3 }} col gap={3}>
          <div className="flex w-full justify-center">
            <DefaultTitle title="Others" />
          </div>
          <DefaultWrapper col noBorder gap={2}>
            {room.players
              .filter((p) => p.id !== user.id)
              .map((p) => (
                <div
                  key={p.id}
                  className="p-2 border border-white rounded-lg flex gap-2 items-center"
                >
                  <Image
                    src={p.image}
                    width={36}
                    height={36}
                    alt={p.username}
                    className="rounded-xl"
                  />
                  <DefaultTitle title={p.name} font="500" text={17} />
                  <div className="border border-grey-70 p-1 rounded-md">
                    <DefaultTitle title={`Answered: ${p.answers?.length}`} />
                    <DefaultTitle title={`Score: ${p.score ?? 0}`} />
                  </div>
                </div>
              ))}
          </DefaultWrapper>
        </DefaultWrapper>
      </main>


    </div>
  );
}
