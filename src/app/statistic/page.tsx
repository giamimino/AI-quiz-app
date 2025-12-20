"use client";
import {
  AreaChartComponentDefault,
  AreaChartComponentLined,
  StatisticContianer,
} from "@/components/templates/statistic-components";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Title from "@/components/ui/default/title";
import { GENERIC_ERROR } from "@/constants/errors";
import {
  countScore,
  handleCountBettleStatus,
  requestAttemptsActivity,
} from "@/lib/actions/actions";
import { useUserStore } from "@/zustand/useUserStore";
import { Icon } from "@iconify/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import months from "@/data/months.json";

export default function StatisticPage() {
  const [score, setScore] = useState<{ challenge: number; game: number }>({
    challenge: 0,
    game: 0,
  });
  const [messages, setMessages] = useState<string[]>([]);
  const [activity, setActivity] = useState<
    { startedAt: string; score: number }[] | null
  >(null);
  const [gameStats, setGameStats] = useState<{
    wins: number;
    losses: number;
  } | null>(null);
  const router = useRouter();
  const userId = useUserStore((state) => state.user?.id);

  useEffect(() => {
    countScore({ userId }).then((res) => {
      if (res.success) {
        setScore({
          challenge: res.totalScore?._sum.score as number,
          game: res.gameScores?._sum.score as number,
        });
      } else {
        setMessages((prev) => [...prev, res.message ?? GENERIC_ERROR]);
      }
    });
  }, []);

  useEffect(() => {
    requestAttemptsActivity({ userId }).then((res) => {
      if (res.success && res.attempts) {
        const sortedAttempts = res.attempts.sort(
          (a, b) => a.startedAt.getTime() - b.startedAt.getTime()
        );
        const formatted = sortedAttempts.map((a) => ({
          startedAt: `${a.startedAt.getDate()} ${months[
            a.startedAt.getMonth()
          ].slice(0, 3)} ${a.startedAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`,
          score: Number(a.score),
        }));
        setActivity(formatted);
      } else {
        setMessages((prev) => [...prev, res.message ?? GENERIC_ERROR]);
      }
    });
  }, []);

  useEffect(() => {
    handleCountBettleStatus({ userId }).then((res) => {
      if (res.success && res.stats) {
        setGameStats(res.stats)
      }
    });
  }, []);

  return (
    <div className="px-5 flex flex-col gap-2.5">
      <AnimatePresence>
        {messages.length > 0 && (
          <ErrorsWrapper>
            {messages.map((c, idx) => (
              <Error
                key={`${c}-${idx}`}
                error={`${c} ${(idx + 1).toFixed().padStart(2, "0")}`}
                handleClose={() =>
                  setMessages((prev) =>
                    prev.filter((_, index) => index !== idx)
                  )
                }
              />
            ))}
          </ErrorsWrapper>
        )}
      </AnimatePresence>
      <button
        onClick={() => router.push("statistic/history")}
        className="text-white p-1 border border-white cursor-pointer z-102 rounded-lg absolute top-2 right-2"
      >
        <Icon icon={"material-symbols:history"} />
      </button>
      <div className="flex w-full justify-center">
        <Title>Statistics</Title>
      </div>
      <StatisticContianer wFit>
        {Object.entries(score).map(([key, value]) => (
          <h1 key={key} className="text-white">
            {key.charAt(0).toUpperCase() + key.slice(1)} Score: {value}p
          </h1>
        ))}
        <h1 className="text-white">
          Total Score: {score.challenge + score.game}p
        </h1>
      </StatisticContianer>
      {activity && (
        <StatisticContianer>
          <Title>Activity</Title>
          <AreaChartComponentLined data={activity} />
        </StatisticContianer>
      )}
      <StatisticContianer wFit>
        {gameStats && (
          <AreaChartComponentDefault
            data={Object.entries(gameStats).map(([key, value]) => ({ label: key, value }))}
            dataKey="value"
            xKey="label"
          />
        )}
      </StatisticContianer>
    </div>
  );
}
