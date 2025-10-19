"use client";
import { Answers, Question } from "@/app/types/global";
import { ChallengePageProps } from "@/app/types/props";
import Quiz from "@/components/quiz/Quiz";
import QuizOption from "@/components/quiz/QuizOption";
import QuizOptions from "@/components/quiz/QuizOptions";
import QuizWrapper from "@/components/quiz/QuizWrapper";
import Timer from "@/components/timer";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import DefaultButton from "@/components/ui/default-button";
import Error from "@/components/ui/error";
import { GENERIC_ERROR } from "@/constants/errors";
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
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id") ?? null;
    if (!id) return router.push(`/challenge/${slug}`);
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
  }, []);

  useEffect(() => {
    if (!start || questions.length > count - 1) return;

    fetch("/api/challenge/question/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setQuestions((prev) => [...prev, data.question]);
        } else {
          setMessages((prev) => [...prev, data.messages]);
        }
      })
      .catch(err => console.log(err))
  }, [position, start]);
  
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
        <Timer start={start} callBack={() => setStart((prev) => !prev)} />
      </div>
      <main className="flex flex-col gap-2.5 items-center">
        <QuizWrapper>
          <Quiz>{questions[position]?.question}</Quiz>
          <QuizOptions>
            {questions[position]?.options.map((option) => (
              <QuizOption
                key={option.id}
                option={option.option}
                selected={answers.some((a) => a.optionId === option.id)}
                onClick={() => {
                  setAnswers((prev) => {
                    const existing = prev.find((a) => a.questionId === questions[position].id)

                    if(existing) {
                      return prev.map(a =>
                        a.questionId === questions[position].id
                          ? { questionId: questions[position].id, optionId: option.id, isCorrect: option.isCorrect }
                          : a
                      )
                    }

                    return [
                      ...prev,
                      {
                        questionId: questions[position].id,
                        optionId: option.id,
                        isCorrect: option.isCorrect
                      }
                    ]
                  });

                  setPosition((prev) => (prev + 1 < count ? prev + 1 : prev));
                }}
              />
            ))}
          </QuizOptions>
          {start && (
            <div className="flex justify-between gap-2.5">
              <DefaultButton
                label="back"
                noSelect
                small
                onClick={() =>
                  setPosition((prev) => (prev !== 0 ? prev - 1 : prev))
                }
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
        </QuizWrapper>
      </main>
    </div>
  );
}
