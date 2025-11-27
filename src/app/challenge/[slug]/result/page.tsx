"use client";
import { ChallengePageProps } from "@/app/types/props";
import {
  ResultOption,
  ResultQuestion,
  ResultsContainer,
  ResultWrapper,
} from "@/components/results";
import DefaultButton from "@/components/ui/default/default-button";
import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useState } from "react";

export interface Answers {
  id: string;
  isCorrect: boolean;
  option: { id: string; option: string };
  question: { id: string; question: string };
}

export default function ChallengeResultPage({ params }: ChallengePageProps) {
  const { slug } = React.use(params);
  const [answers, setAnswers] = useState<Answers[]>([]);
  const [seeMore, setSeeMore] = useState(false);
  const [attempt, setAttempt] = useState<{
    finishedAt: Date;
    startedAt: Date;
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    const url = new URL(window.location.href)
    const attemptId = url.searchParams.get("attemptId")
    fetch("/api/challenge/result/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          setAttempt({
            startedAt: data.attempt.startedAt,
            finishedAt: data.attempt.finishedAt,
          });
          setAnswers(data.answers);
        }
      });
      url.searchParams.delete("attemptId")
      window.history.replaceState({}, "", url.toString())
  }, []);

  const results = useMemo(() => {
    if (answers.length === 0 || !Array.isArray(answers)) return;
    const correct = answers.filter((a) => a.isCorrect).length;

    const incorrect = answers.length - correct;
    return {
      correct,
      incorrect,
      all: answers.length,
    };
  }, [answers, slug]);

  return (
    <div>
      {attempt && results && (
        <div
          className="flex w-full justify-center [&_span]:text-white [&_div]:flex
      [&_div]:items-center [&_div]:gap-1 gap-1.5"
        >
          <div>
            <Icon icon={"icon-park-solid:correct"} className="text-green-600" />
            <span>{results?.correct}</span>
          </div>
          <div>
            <Icon icon={"dashicons:no"} className="text-red-600" />
            <span>{results?.incorrect}</span>
          </div>
          <div>
            <Icon icon={"material-symbols:circle"} className="text-white" />
            <span>{results?.all}</span>
          </div>
          <div>
            <Icon icon={"mingcute:time-fill"} className="text-white" />
            <span>
              {(
                (new Date(attempt.finishedAt).getTime() -
                  new Date(attempt.startedAt).getTime()) /
                1000
              ).toFixed(0)}
              s
            </span>
          </div>
        </div>
      )}
      {!seeMore && (
        <div className="flex justify-center w-full mt-2">
          <DefaultButton label="See More" onClick={() => setSeeMore(true)} />
        </div>
      )}
      <ResultsContainer>
        {seeMore &&
          Array.isArray(answers) &&
          answers.map((a, idx) => (
            <ResultWrapper key={a.id} index={idx}>
              <ResultQuestion question={a?.question?.question} index={idx} />
              <ResultOption isCorrect={a.isCorrect} option={a.option.option} />
            </ResultWrapper>
          ))}
      </ResultsContainer>
    </div>
  );
}
