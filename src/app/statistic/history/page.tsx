"use client";
import { ChallengeHistory } from "@/app/types/global";
import {
  HistoryContianer,
  HistoryDescription,
  HistoryTitle,
  HistoryWrapper,
} from "@/components/templates/history-components";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Title from "@/components/ui/default/title";
import { requestAttempts, requestDeleteAttempt } from "@/lib/actions/actions";
import { useUserStore } from "@/zustand/useUserStore";
import { Icon } from "@iconify/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<ChallengeHistory[] | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const router = useRouter();
  const userId = useUserStore((state) => state.user)?.id;
  useEffect(() => {
    requestAttempts({ userId: userId ?? null }).then((res) => {
      if (res.success && res.attempts) {
        setHistory(res.attempts);
      }
    });
  }, []);

  async function handleDeleteAttempt(attemptId: string) {
    const res = await requestDeleteAttempt({ attemptId });

    setMessages((prev) => [...prev, res.message]);
    setHistory((prev) =>
      prev ? prev.filter((h) => h.id !== attemptId) : prev
    );
  }

  function handleRediretcResult(attemptId: string) {
    const attempt = history?.find((h) => h.id === attemptId);
    router.push(
      `/challenge/${attempt?.challenge.slug}/result?attemptId=${attemptId}`
    );
  }

  return (
    <div>
      <AnimatePresence>
        {messages.length > 0 && (
          <ErrorsWrapper>
            {messages.map((c, idx) => (
              <Error
                key={`${c}-${idx}`}
                error={c}
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
        onClick={() => router.push("/statistic")}
        className="text-white p-1 border border-white cursor-pointer z-102 rounded-lg absolute top-2 left-10"
      >
        <Icon icon={"lets-icons:back"} />
      </button>
      <Title xCenter>History</Title>
      <HistoryContianer>
        {history?.map((h, index) => (
          <HistoryWrapper
            key={h.id}
            col
            delay={Math.min(index * 0.1, 0.8)}
            id={h.id}
            handleResult={handleRediretcResult}
            handleDelete={handleDeleteAttempt}
            score={h.score}
            topic={h.challenge.topic ?? "topic"}
            finishedIn={
              (h.finishedAt
                ? Number(
                    (
                      (new Date(h.finishedAt).getTime() -
                        new Date(h.startedAt).getTime()) /
                      1000
                    ).toFixed(2)
                  )
                : false) as number | boolean
            }
          >
            <HistoryTitle title={h.challenge.title} />
            <HistoryDescription description={h.challenge.description} />
            <span
              className="p-1 bg-gray-700 rounded-lg absolute text-white
            right-3 top-2 max-sm:top-1.5 max-sm:right-2"
            >
              {h.challenge.type === "AI" ? (
                <Icon icon={"hugeicons:artificial-intelligence-04"} />
              ) : (
                <Icon icon={"gravity-ui:person-fill"} />
              )}
            </span>
          </HistoryWrapper>
        ))}
      </HistoryContianer>
    </div>
  );
}
