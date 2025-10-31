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
import { useUserStore } from "@/zustand/useUserStore";
import { countReactions, handleReactChallenge } from "@/lib/actions/actions";
import { GENERIC_ERROR } from "@/constants/errors";

export default function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = use(params);
  const userId = useUserStore((state) => state.user?.id) ?? null;
  const [challenge, setChallenge] = useState<ChallengeReview | null>(null);
  const [finishedAt, setFinishedAt] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [reactions, setReactions] = useState<
    {
      icon: string;
      type: "LIKE" | "DISLIKE" | "STAR";
      color: string;
      activeIcon: string;
      isActive: boolean;
      _count: number;
    }[]
  >([
    {
      icon: "mdi:heart-outline",
      type: "LIKE",
      color: "text-red-600",
      activeIcon: "mdi:heart",
      isActive: false,
      _count: 0,
    },
    {
      icon: "solar:star-line-duotone",
      type: "STAR",
      color: "text-yellow-500",
      activeIcon: "solar:star-bold",
      isActive: false,
      _count: 0,
    },
    {
      icon: "mdi:dislike-outline",
      type: "DISLIKE",
      color: "text-blue-600",
      activeIcon: "mdi:dislike",
      isActive: false,
      _count: 0,
    },
  ]);
  const challengeId = useSearchParams().get("id") ?? null;
  const createdAt = challenge && new Date(challenge.createdAt);
  const router = useRouter();

  function calculateFinishedIn() {
    if (!finishedAt || !createdAt) return "0s";

    const finishedAtDate = new Date(finishedAt);
    const createdAtDate = new Date(createdAt);

    const sec = (finishedAtDate.getTime() - createdAtDate.getTime()) / 1000;
    return `${sec?.toFixed(0)}s`;
  }

  const finishedIn = calculateFinishedIn();

  async function handleReaction(type: "LIKE" | "DISLIKE" | "STAR") {
    const res = await handleReactChallenge({
      type,
      userId,
      challengeId: challengeId ?? "",
    });

    if (res.success && res.reaction) {
      setReactions((prev) =>
        prev
          ? prev.map((r) =>
              r.type === res.reaction.type
                ? { ...r, _count: r._count + 1, isActive: true }
                : r
            )
          : prev
      );
    } else {
      setMessages((prev) => [...prev, res.message ?? GENERIC_ERROR]);
    }
  }

  useEffect(() => {
    if (!slug || !challengeId) return;

    startTransition(async () => {
      const res = await fetch(`/api/challenge/get?id=${challengeId}`);
      const data = await res.json();

      startTransition(() => {
        if (data.success) {
          setChallenge(data.challenge);
          setFinishedAt(data.challenge.attempts.length ? data.challenge.attempts[0].finishedAt : "");
        } else {
          setMessages((prev) => [...prev, data.message]);
        }
      });
    });
  }, [slug, challengeId]);

  useEffect(() => {
    if (!slug || !challengeId) return;

    countReactions({ challengeId }).then((res) => {
      if (res.success && res.reactions) {
        setReactions((prev) =>
          prev
            ? prev.map((r) =>
                r.type === "LIKE"
                  ? {
                      ...r,
                      _count: res.reactions.countLikes?._count.reactions ?? 0,
                    }
                  : r.type === "STAR"
                  ? {
                      ...r,
                      _count: res.reactions.countStars?._count.reactions ?? 0,
                    }
                  : r
              )
            : prev
        );
      }
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
        <p className="text-white/70  px-1">{challenge?.description}</p>
        <p className="text-white/70 ">Questions: {challenge?._count.questions}</p>
        <div>
          <button onClick={() => router.push(`/challenge/search?topic=${challenge?.topic}`)} className="text-white/70 cursor-pointer w-fit">
            #{challenge?.topic}
          </button>
        </div>
        {!finishedAt ? (
          <DefaultButton
            label="Start"
            wFit
            noSelect
            onClick={() => router.push(`${slug}/start?id=${challengeId}`)}
          />
        ) : (
          <>
            <p className="text-white/80">This Challenge already finished</p>
            <p className="text-white/80">
              Finished in <span>{finishedIn}</span>
            </p>
          </>
        )}
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
          {reactions.map((r) => (
            <button
              key={r.type}
              onClick={() => handleReaction(r.type)}
              className="flex items-center gap-[2px]"
            >
              <Icon
                icon={r.isActive ? r.activeIcon : r.icon}
                className={r.color}
              />
              {r.type !== "DISLIKE" && <p className="text-white">{r._count}</p>}
            </button>
          ))}
        </div>
      </ProfileWrapper>
    </div>
  );
}
