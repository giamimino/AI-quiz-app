"use client";
import { ChallengeReview } from "@/app/types/global";
import { ChallengePageProps } from "@/app/types/props";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import ProfileWrapper from "@/components/ui/ProfileWrapper";
import Error from "@/components/ui/error";
import Title from "@/components/ui/title";
import { Icon } from "@iconify/react";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState, useTransition } from "react";
import months from "@/data/months.json";
import ChallengeLoading from "@/components/ui/loading/ChallengeLoading";
import DefaultButton from "@/components/ui/default-button";

export default function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = use(params);
  const [challenge, setChallenge] = useState<ChallengeReview | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const challengeId = useSearchParams().get("id") ?? null;
  const createdAt = challenge && new Date(challenge.createdAt);
  const router = useRouter();
  useEffect(() => {
    if (!slug || !challengeId) return;

    startTransition(async () => {
      const res = await fetch(`/api/challenge/get?id=${challengeId}`);
      const data = await res.json();
      startTransition(() => {
        if (data.success) {
          setChallenge(data.challenge);
        } else {
          setMessages((prev) => [...prev, data.message]);
        }
      });
    });
  }, [slug, challengeId]);

  if (isPending)
    return (
      <div className="p-4">
        <ChallengeLoading />
      </div>
    );
  return (
    <div className="flex p-4 flex-col">
      <AnimatePresence>
        {messages.length > 0 && Array.isArray(messages) && (
          <ErrorsWrapper>
            {messages.map((c, idx) => (
              <Error
                key={`${c.toString()}-${idx}`}
                error={c.toString()}
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
      <ProfileWrapper wFull col rel>
        <span className="absolute top-2 text-white right-2 p-1 bg-gray-700 rounded-lg">
          {challenge?.type === "AI" ? (
            <Icon icon={"hugeicons:artificial-intelligence-04"} />
          ) : (
            <Icon icon={"gravity-ui:person-fill"} />
          )}
        </span>
        <Title>{challenge?.title}</Title>
        <p className="text-white/70 max-w-80">{challenge?.description}</p>
        <p className="text-white/70 ">Questions: 5</p>
        <div>
          <p className="text-white/70 cursor-pointer w-fit">
            #{challenge?.topic}
          </p>
        </div>
        <DefaultButton label="Start" wFit noSelect onClick={() => router.push(`${slug}/start?id=${challengeId}`)} />
        <span className="w-12 h-0.5 rounded-full bg-white/80 mt-4"></span>
        <div className="text-white/80">
          <span>Created by </span>
          <button
            className="text-white transition 
          cursor-pointer"
            onClick={() =>
              router.push(
                `/profile/${challenge?.creator.username}?id=${challenge?.creator.id}`
              )
            }
          >
            {challenge?.creator.name}
          </button>{" "}
          <span>in </span>
          <span>
            {`${createdAt?.getDate()} ${
              months[createdAt?.getMonth() as number]
            } ${createdAt?.getFullYear()}`}
          </span>
        </div>
        <div
          className="absolute bottom-5 right-5 flex gap-1.5 items-center 
        [&_button]:cursor-pointer"
        >
          <button>
            <Icon icon={"mdi:heart-outline"} className="text-red-600" />
          </button>
          <button>
            <Icon icon={"mdi:dislike-outline"} className="text-blue-600" />
          </button>
          <button>
            <Icon
              icon={"solar:star-line-duotone"}
              className="text-yellow-500"
            />
          </button>
        </div>
      </ProfileWrapper>
    </div>
  );
}
