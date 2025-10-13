"use client";
import { UserProiflePageProps } from "@/app/types/props";
import { Challenge, user } from "@/app/types/user";
import Error from "@/components/ui/error";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import ProfileImage from "@/components/ui/ProfileImage";
import ProfileWrapper from "@/components/ui/ProfileWrapper";
import Title from "@/components/ui/title";
import { Icon } from "@iconify/react";
import { AnimatePresence } from "framer-motion";
import React, { use, useEffect, useState } from "react";

export default function UserProfilePage({ params }: UserProiflePageProps) {
  const { username } = use(params);
  const [userData, setUserData] = useState<user | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    if (!username) return;
    fetch("/api/user/get/by_username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username[0] }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserData(data.user);
        } else {
        }
      });
  }, [username]);

  if(!userData?.image) return

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
        <div className="flex flex-col [&_p]:text-white/60 [&_p]:text-xs
          [&_span]:text-white/60">
          <Title>{userData?.name}</Title>
          <p>{userData.username}</p>
          {userData.birthday && (
            <h2>
              <Icon icon={"la:birthday-cake"} />
              <span>{userData.birthday}</span>
            </h2>
          )}
          <div className="flex flex-wrap gap-2.5">
            <h3 className="flex gap-0.5 items-center">
              <Icon icon={"mdi:heart-outline"} className="text-red-600" />
              <span>{userData.reactions.likes}</span>
            </h3>
            <h3 className="flex gap-0.5 items-center">
              <Icon icon={"solar:star-line-duotone"} className="text-yellow-500" />
              <span>{userData.reactions.favorites}</span>
            </h3>
            <h3 className="flex gap-0.5 items-center">
              <Icon icon={"mdi:dislike-outline"} className="text-blue-600" />
              <span>{userData.reactions.dislikes}</span>
            </h3>
          </div>
        </div>
      </ProfileWrapper>
      <ProfileWrapper col>
        <Title>Challenges</Title>

      </ProfileWrapper>
    </div>
  );
}
