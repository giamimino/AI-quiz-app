"use client";
import { Answers, Question } from "@/app/types/global";
import { ChallengePageProps } from "@/app/types/props";
import Quiz from "@/components/quiz/Quiz";
import QuizOption from "@/components/quiz/QuizOption";
import QuizOptions from "@/components/quiz/QuizOptions";
import QuizWrapper from "@/components/quiz/QuizWrapper";
import Timer from "@/components/timer";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import DefaultButton from "@/components/ui/default/default-button";
import Error from "@/components/ui/error";
import Loading from "@/components/ui/loading/Loading";
import { GENERIC_ERROR, RESULT_REQUEST_ERROR } from "@/constants/errors";
import { challengeStart, sendResult } from "@/lib/actions/actions";
import { useUserStore } from "@/zustand/useUserStore";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

export default function ChallengeStartPage({ params }: ChallengePageProps) {
  const { slug } = use(params);
  const [start, setStart] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [position, setPosition] = useState(0);
  const [challengeId, setChallengeId] = useState("");
  const [count, setCount] = useState(0);
  const [attemptId, setAtemptId] = useState("");
  const userId = useUserStore((state) => state.user)?.id ?? null;
  const { setUser } = useUserStore()
  const router = useRouter();

  useEffect(() => {
    if (!slug || count !== 0) return;
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    console.log(id);

    if (!id) return;
    setChallengeId(id);

    fetch("/api/challenge/question/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCount(data.count);
        } else {
          setMessages((prev) => [...prev, data.messages ?? GENERIC_ERROR]);
        }
      });
  }, [count, slug, router]);

  useEffect(() => {
    if (!start || questions.length > count - 1) return;

    fetch("/api/challenge/question/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions((prev) => [...prev, data.question]);
          if(data.session) {
            setUser(data.session)
          }
        } else {
          setMessages((prev) => [...prev, data.message]);
        }
      })
      .catch((err) => console.log(err));
  }, [position, start, challengeId]);

  return (
    <div className="flex flex-col gap-2.5">
      <ErrorsWrapper>
        <AnimatePresence initial={false}>
          {messages.length > 0 &&
            messages.map((m, idx) => (
              <Error
                key={`${m}-${idx}`}
                error={m}
                handleClose={() =>
                  setMessages((prev) =>
                    prev.filter((_, index) => index !== idx)
                  )
                }
              />
            ))}
        </AnimatePresence>
      </ErrorsWrapper>
      <div className="flex justify-center">
        <Timer
          start={start}
          callBack={async () => {
            if (!start) {
              const res = await challengeStart({ challengeId, userId });

              if (res.success) {
                setStart(true);
                setAtemptId(res.atempt?.id as string);
                if (res.finished) {
                  router.back();
                }
              } else {
                setMessages((prev) => [...prev, res.message ?? GENERIC_ERROR]);
              }
            }
          }}
        />
      </div>
      <main className="flex flex-col gap-2.5 items-center">
        <QuizWrapper>
          {questions[position] ? (
            <>
              <Quiz key={questions[position]?.id}>
                {questions[position]?.question}
              </Quiz>
              <QuizOptions>
                {questions[position]?.options.map((option) => (
                  <QuizOption
                    key={option.id}
                    option={option.option}
                    selected={answers.some((a) => a.optionId === option.id)}
                    onClick={() => {
                      setAnswers((prev) => {
                        const existing = prev.find(
                          (a) => a.questionId === questions[position].id
                        );

                        if (existing) {
                          return prev.map((a) =>
                            a.questionId === questions[position].id
                              ? {
                                  questionId: questions[position].id,
                                  optionId: option.id,
                                  isCorrect: option.isCorrect,
                                }
                              : a
                          );
                        }

                        return [
                          ...prev,
                          {
                            questionId: questions[position].id,
                            optionId: option.id,
                            isCorrect: option.isCorrect,
                          },
                        ];
                      });

                      setPosition((prev) =>
                        prev + 1 < count ? prev + 1 : prev
                      );
                    }}
                  />
                ))}
              </QuizOptions>
            </>
          ) : (
            <div className="relative">
            </div>
          )}
          {start && (
            <div className="flex justify-between gap-2.5">
              <DefaultButton
                label="back"
                noSelect
                small
                onClick={() => {
                  setPosition((prev) => (prev !== 0 ? prev - 1 : prev));
                }}
              />
              <p className="text-white">
                <span>{position + 1}</span>
                <span>/</span>
                <span>{count}</span>
              </p>
              <DefaultButton
                label="next"
                noSelect
                small
                onClick={() =>
                  setPosition((prev) => (prev + 1! < count ? prev + 1 : prev))
                }
              />
            </div>
          )}
          {start && (
            <div className="flex justify-between gap-2.5">
              <DefaultButton
                label="Result"
                onClick={async () => {
                  if (answers.length === count) {
                    const res = await sendResult({ answers, attemptId });

                    if (res.success) {
                      router.push(`result?attemptId=${res.attemptId}`);
                    } else {
                      setMessages((prev) => [
                        ...prev,
                        res.message ?? GENERIC_ERROR,
                      ]);
                    }
                  } else {
                    setMessages((prev) => [...prev, RESULT_REQUEST_ERROR]);
                  }
                }}
              />
            </div>
          )}
        </QuizWrapper>
      </main>
    </div>
  );
}
