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
import months from "@/data/months.json";
import { useUserStore } from "@/zustand/useUserStore";
import DefaultWrapper from "@/components/ui/default/default-wrapper";
import { removeFriendRequest } from "@/lib/actions/actions";

export default function UserProfilePage({ params }: UserProiflePageProps) {
  const { username } = use(params);
  const [userData, setUserData] = useState<user | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const { user, setUser } = useUserStore();

  const handleFriendRequest = async () => {
    try {
      if (!userData) return;

      const res = await fetch("/api/user/post/friend/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: user?.id,
          receiverId: userData.id,
        }),
      });
      const result = await res.json();

      if (result.success) {
        setMessages((prev) => [...prev, "Friend request sent."]);
        setRequestSent(true);
        if (result.session) {
          setUser(result.session);
        }
      } else if (!result.success && result.message) {
        setMessages((prev) => [...prev, result.message]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFriendRequest = async () => {
    try {
      if (
        !userData ||
        !user ||
        !userData.friendRequestsReceived.some((f) => f.requester.id === user.id)
      )
        return;
      const res = await removeFriendRequest({
        requestId: userData.friendRequestsReceived.find(
          (f) => f.requester.id === user.id
        )!.id,
      });

      if (res.success) {
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                friendRequestsReceived: prev.friendRequestsReceived.filter(
                  (f) => f.requester.id !== user.id
                ),
              }
            : prev
        );
        setRequestSent(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        mainUserId: user?.id,
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

  if (loading) return <Loading />;
  if (!userData || !user)
    return (
      <div>
        <p className="text-white">no user found.</p>
      </div>
    );

  console.log(userData);

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
        <DefaultWrapper dFlex gap={2.5} noBorder>
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
                <span>{`${new Date(userData.birthday).getDate()} ${
                  months[new Date(userData.birthday).getMonth()]
                }`}</span>
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
        </DefaultWrapper>
        <button
          className="text-white cursor-pointer underline self-start"
          onClick={
            userData.friendRequestsReceived.some(
              (f) => f.requester.id === user?.id
            ) || requestSent
              ? handleRemoveFriendRequest
              : handleFriendRequest
          }
        >
          {userData.friendRequestsReceived.some(
            (f) => f.requester.id === user?.id
          ) || requestSent
            ? "remove friend"
            : "add friend"}
        </button>
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
