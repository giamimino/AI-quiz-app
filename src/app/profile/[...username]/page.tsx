"use client";
import { UserProiflePageProps } from "@/app/types/props";
import { user } from "@/app/types/user";
import ChallengeHero from "@/components/ui/challenges/Challenge-hero";
import ChallengesWrapper from "@/components/ui/challenges/ChallengesWrapper";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Loading from "@/components/ui/loading/Loading";
import ProfileImage from "@/components/ui/ProfileImage";
import ProfileWrapper from "@/components/ui/ProfileWrapper";
import Title from "@/components/ui/default/title";
import { Icon } from "@iconify/react";
import { AnimatePresence } from "framer-motion";
import React, { use, useEffect, useState } from "react";
import months from "@/data/months.json"

export default function UserProfilePage({ params }: UserProiflePageProps) {
  const { username } = use(params);
  const [userData, setUserData] = useState<user | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id") ?? null;
    fetch("/api/user/get/by_username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username[0],
        ...(id ? { userId: id } : {}),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserData(data.user);
        } else {
          setMessages((prev) => [...prev, data.message]);
        }
        setLoading(false);
        url.searchParams.delete("id");
        window.history.replaceState({}, "", url.toString());
      });
  }, [username]);

  if (loading) return <Loading />;
  if (!userData)
    return (
      <div>
        <p className="text-white">no user found.</p>
      </div>
    );

  return (
    <div className="p-5 flex flex-col gap-2.5">
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
      <ProfileWrapper col gap={2.5}>
        <ProfileImage src={userData?.image as string} alt="user-profile" />
        <div
          className="flex flex-col [&_p]:text-white/60 [&_p]:text-xs
          [&_span]:text-white/60"
        >
          <Title>{userData?.name}</Title>
          <p>{userData.username}</p>
          {userData.birthday && (
            <h2 className="text-white flex items-center gap-2">
              <Icon icon={"la:birthday-cake"} />
              <span>{`${new Date(userData.birthday).getDate()} ${months[new Date(userData.birthday).getMonth()]}`}</span>
            </h2>
          )}
          <div className="flex flex-wrap gap-2.5">
            <h3 className="flex gap-0.5 items-center">
              <Icon icon={"mdi:heart-outline"} className="text-red-600" />
              <span>{userData.reactions.likes}</span>
            </h3>
            <h3 className="flex gap-0.5 items-center">
              <Icon
                icon={"solar:star-line-duotone"}
                className="text-yellow-500"
              />
              <span>{userData.reactions.favorites}</span>
            </h3>
          </div>
        </div>
      </ProfileWrapper>
      <ProfileWrapper col>
        <Title>Challenges</Title>
        <ChallengesWrapper>
          {userData.challenges?.map((c) => (
            <ChallengeHero
              key={`${c.id}`}
              {...c}
              description={
                c.description.length > 150
                  ? `${String(c.description).slice(0, 150)}...`
                  : c.description
              }
              isFinished={false}
            ></ChallengeHero>
          ))}
        </ChallengesWrapper>
      </ProfileWrapper>
    </div>
  );
}
