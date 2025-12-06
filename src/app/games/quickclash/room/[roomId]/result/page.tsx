"use client";
import { RoomPageProps } from "@/app/types/props";
import WinnerGreet from "@/components/ui/animations/winner-greet";
import DefaultTitle from "@/components/ui/default/default-title";
import DefaultWrapper from "@/components/ui/default/default-wrapper";
import Loading from "@/components/ui/loading/Loading";
import { db } from "@/configs/firebase";
import { FireStoreRooms } from "@/types/firestore";
import { FindWinner } from "@/utils/FindWinner";
import { useUserStore } from "@/zustand/useUserStore";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

export default function RoomGameResultPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const { user, setUser } = useUserStore();
  const roomRef = doc(db, "rooms", roomId);
  const [room, setRoom] = useState<FireStoreRooms | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
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
      setLoading(false);
      if(data.createdBy !== user.id) return
      const res = await fetch("/api/game/result/post", {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify({ roomId, userId: user.id })
      })
      const result = await res.json()

      console.log(result);
      
    })();
  }, [user]);

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
      <WinnerGreet
        winner={FindWinner(room)}
        players={MapRoomPlayers()}
        onEnd={() => setInitialized(true)}
      />
      {initialized && (
        <div className="w-full">
          <div className="w-full flex justify-center">
            <DefaultTitle title="Players" text={20} font="700" />
          </div>
          <div className="flex gap-2.5 py-2.5 px-3.5">
            {room.players.map((p) => (
              <DefaultWrapper
                key={`${p.id}-${p.username}`}
                rel
                {...(FindWinner(room) === p.id
                  ? { borderColor: "oklch(52.7% 0.154 150.069)" }
                  : { borderColor: "#e7000b" })}
              >
                <DefaultWrapper
                  dFlex
                  gap={2.5}
                  noBorder={{ t: true, l: true, r: true }}
                  p={{ p: 2 }}
                  noRounded={true}
                  noOverflow
                  justifyBetween
                >
                  <div className="flex gap-2.5">
                    <Image
                      src={p.image}
                      width={46}
                      height={46}
                      alt={p.username}
                      className="object-cover rounded-xl"
                    />
                    <div className="flex flex-col justify-between">
                      <DefaultTitle
                        title={p.id === user.id ? "You" : p.name}
                        text={20}
                        font="500"
                      />
                      <p className="text-grey-70 text-xs">{p.username}</p>
                    </div>
                  </div>
                  <div className="self-end justify-self-end flex flex-col justify-between [&_h1]:text-grey-60 [&_h1]:text-sm">
                    <h1>Time: {"wd"}</h1>
                    <h1>Score: {p.score}</h1>
                  </div>
                </DefaultWrapper>
                <DefaultWrapper p={{ p: 3 }} noBorder noRounded col gap={2.5}>
                  {p.answers?.map((a, idx) => {
                    const questionObject = room.questions?.find(
                      (q) => q.id === a.questionId
                    );
                    const isCorrect = questionObject?.answer === a.answer;
                    return (
                      <motion.div
                        initial={{ filter: "blur(3px)", opacity: 0 }}
                        animate={{ filter: "blur(0px)", opacity: 1 }}
                        transition={{ delay: idx / 10 }}
                        key={a.questionId}
                      >
                        <h1 className="text-base text-white">
                          {questionObject?.question ?? ""}
                        </h1>
                        <p className="text-grey-70 text-sm">
                          {p.id === user.id ? "Your" : `${p.name}'s`} answer
                          was:{" "}
                          <span
                            className={`${
                              isCorrect
                                ? "text-green-600"
                                : "text-red-600 line-through"
                            }`}
                          >
                            {a.answer}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-grey-70 text-sm">
                            Answer: {questionObject?.answer}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </DefaultWrapper>
                {FindWinner(room) === p.id && (
                  <motion.div
                    animate={{ textShadow: ["0 0 3px", "0 0 6px", "0 0 3px"] }}
                    transition={{
                      duration: 2,
                      times: [0, 0.3, 1],
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: [0.57, 0.80, 0.39, 1],
                    }}
                    className="absolute left-1/2 -translate-x-1/2 -bottom-10 text-2xl text-green-700 font-bold text-shadow-[0_0_5px] text-shadow-green-600"
                  >
                    win
                  </motion.div>
                )}
              </DefaultWrapper>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
