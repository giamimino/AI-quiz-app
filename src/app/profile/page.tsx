"use client";
import Challenge from "@/components/ui/challenges/Challenge";
import ChallengesWrapper from "@/components/ui/challenges/ChallengesWrapper";
import CostumnChallenge from "@/components/ui/challenges/CostumChallenge";
import ProfileContainer from "@/components/ui/ProfileContainer";
import { useUserStore } from "@/zustand/useUserStore";
import React, { useCallback, useEffect, useState } from "react";
import data from "@/data/challenges/challenges.json";
import { delay } from "@/utils/delay";
import ProfileWrapperLoading from "@/components/ui/loading/ProfileWrapperLoding";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ProfileImage from "@/components/ui/ProfileImage";
import Title from "@/components/ui/title";
import { useChallengeStore } from "@/zustand/useChallengeStore";
import { AnimatePresence } from "framer-motion";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Error from "@/components/ui/error";
import ChallengeHero from "@/components/ui/challenges/Challenge-hero";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { challangeDelete } from "@/lib/actions/actions";
const ProfileWrapper = dynamic(
  () => delay(350).then(() => import("@/components/ui/ProfileWrapper")),
  {
    loading: () => <ProfileWrapperLoading col gap={0.5} />,
    ssr: false,
  }
);

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const challenges = useChallengeStore((state) => state.challenge);
  const setChallenges = useChallengeStore((state) => state.setChallenge);
  const [message, setMessage] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  
  const handleChallengeDel = useCallback(async (id: string) => {
    try {
      const res = await challangeDelete(id)
      setMessage(prev => [...prev, res.message])
      const newChallenges = (challenges ?? []).filter(c => c.id !== id)
      setChallenges(newChallenges)
    } catch(err) {
      setMessage(prev => [...prev, "Failed to delete challenge"])
    }
  }, [challenges, setChallenges]) 

  useEffect(() => {
    if (user) return;
    fetch("/api/user/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    const url = new URL(window.location.href);
    const cId = url.searchParams.get("c");
    fetch("/api/challenge/get/by_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        ...(cId && { challengeId: cId }),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.newChallenge) {
            setChallenges([...(challenges ?? []), data.challenges]);
            url.searchParams.delete("c");
            window.history.replaceState({}, "", url.toString());
          } else {
            setChallenges(data.challenges);
          }
        } else {
          setMessage((prev) => [...prev, data.message]);
        }
      });
  }, [user]);


  if (!user?.image) return;
  return (
    <div className="text-white p-8">
      <AnimatePresence>
        {message.length > 0 && (
          <ErrorsWrapper>
            {message.map((c, idx) => (
              <Error
                key={`${c}-${idx}`}
                error={c}
                handleClose={() =>
                  setMessage((prev) => prev.filter((_, index) => index !== idx))
                }
              />
            ))}
          </ErrorsWrapper>
        )}
      </AnimatePresence>
      <ProfileContainer flexWrap>
        <ProfileWrapper gap={0.5} col>
          <img
            src={user?.image}
            width={48}
            height={48}
            className="rounded-full mb-2.5"
          />
          {user &&
            Object.entries(user).map(
              ([key, value]) =>
                key !== "image" &&
                key !== "id" && (
                  <p className="text-nowrap" key={key + "-" + value}>
                    {key}: {String(value)}
                  </p>
                )
            )}
        </ProfileWrapper>
        <ProfileWrapper hFit col gap={2}>
          <h1 className="text-lg font-semibold">Challenges</h1>
          <ChallengesWrapper>
            {data.map((c) => (
              <Challenge key={c} challenge={c} />
            ))}
          </ChallengesWrapper>
          <CostumnChallenge onClick={() => router.push("/create/challenge")} />
        </ProfileWrapper>
        <ProfileWrapper hFit col xCenter gap={2.5}>
          <ProfileImage src={user?.image as string} w={64} h={64} r={12} />
          <button className="cursor-pointer">Change a picture</button>
        </ProfileWrapper>
        <ProfileWrapper wFull col gap={2.5}>
          <div className="flex justify-between">
            <Title>My Challenges</Title>
            <button
              className={clsx(
                "cursor-pointer transition hover:text-red-400",
                deleting ? "text-red-600" : "text-white/80"
              )}
              onClick={() => setDeleting(prev => !prev)}
            >
              <Icon
                icon={deleting ? "basil:trash-solid" : "basil:trash-outline"}
              />
            </button>
          </div>
          <ChallengesWrapper>
            {challenges?.map((c) => (
              <ChallengeHero key={`${c.id}`} {...c} {...deleting && { isDeleting: true } } callbackDelete={(id: string) => handleChallengeDel(id)}></ChallengeHero>
            ))}
          </ChallengesWrapper>
        </ProfileWrapper>
      </ProfileContainer>
    </div>
  );
}
