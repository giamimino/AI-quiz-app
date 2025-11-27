"use client";
import Challenge from "@/components/ui/challenges/Challenge";
import ChallengesWrapper from "@/components/ui/challenges/ChallengesWrapper";
import CostumnChallenge from "@/components/ui/challenges/CostumChallenge";
import ProfileContainer from "@/components/ui/ProfileContainer";
import { useUserStore } from "@/zustand/useUserStore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import data from "@/data/challenges/challenges.json";
import { delay } from "@/utils/delay";
import ProfileWrapperLoading from "@/components/ui/loading/ProfileWrapperLoding";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ProfileImage from "@/components/ui/ProfileImage";
import Title from "@/components/ui/default/title";
import { useChallengeStore } from "@/zustand/useChallengeStore";
import { AnimatePresence, motion } from "framer-motion";
import ErrorsWrapper from "@/components/ui/ErrorsWrapper";
import Error from "@/components/ui/error";
import ChallengeHero from "@/components/ui/challenges/Challenge-hero";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import {
  challangeDelete,
  handleGetChallenges,
  handleGetFavorites,
  handleGetLiked,
} from "@/lib/actions/actions";
import DefaultButton from "@/components/ui/default/default-button";
import Image from "next/image";
const ProfileWrapper = dynamic(
  () => delay(350).then(() => import("@/components/ui/ProfileWrapper")),
  {
    loading: () => <ProfileWrapperLoading col gap={0.5} />,
    ssr: false,
  }
);

const sections: { label: "My Challenges" | "Likes" | "Favorites" }[] = [
  { label: "My Challenges" },
  { label: "Likes" },
  { label: "Favorites" },
];

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const challenges = useChallengeStore((state) => state.challenge);
  const setChallenges = useChallengeStore((state) => state.setChallenge);
  const [message, setMessage] = useState<string[]>([]);
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<
    "My Challenges" | "Likes" | "Favorites"
  >("My Challenges");
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleHovered = (
    index: number,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    setHovered(index);
    const navRect = navRef.current?.getBoundingClientRect();
    const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (navRect) {
      setIndicatorProps({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  };

  const handleChallengeDel = useCallback(
    async (id: string) => {
      try {
        const res = await challangeDelete(id);
        setMessage((prev) => [...prev, res.message]);
        const newChallenges = (challenges ?? []).filter((c) => c.id !== id);
        setChallenges(newChallenges);
      } catch (err) {
        console.log(err);
        setMessage((prev) => [...prev, "Failed to delete challenge"]);
      }
    },
    [challenges, setChallenges]
  );

  const filteredChallenges = useMemo(() => {
    if (selectedSection === "My Challenges") {
      return challenges.filter((c) => c.reactionType === "Mine");
    } else if (selectedSection === "Likes") {
      return challenges.filter((c) => c.reactionType === "Liked");
    } else if (selectedSection === "Favorites") {
      return challenges.filter((c) => c.reactionType === "Favorites");
    }
    return [];
  }, [selectedSection, challenges]);

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
    if (!user || !selectedSection) return;

    const alreadyHasMine = challenges.some((c) => c.reactionType === "Mine");
    const alreadyHasLiked = challenges.some((c) => c.reactionType === "Liked");
    const alreadyHasFavorites = challenges.some(
      (c) => c.reactionType === "Favorites"
    );

    if (selectedSection === "My Challenges" && !alreadyHasLiked) {
      handleGetChallenges({ userId: user.id }).then((res) => {
        if (res.success && res.challenges && !alreadyHasMine) {
          setChallenges([...challenges, ...res.challenges]);
        }
      });
    } else if (selectedSection === "Likes" && !alreadyHasLiked) {
      handleGetLiked({ userId: user.id }).then((res) => {
        if (res.success && res.challanges && !alreadyHasLiked) {
          setChallenges([...challenges, ...res.challanges]);
        }
      });
    } else if (selectedSection === "Favorites" && !alreadyHasFavorites) {
      handleGetFavorites({ userId: user.id }).then((res) => {
        if (res.success && res.challenges && !alreadyHasFavorites) {
          setChallenges([...challenges, ...res.challenges]);
        }
      });
    }
  }, [user, selectedSection]);

  if (!user?.image) return;
  return (
    <div className="text-white p-8">
      <div className="absolute z-102 right-2 top-2 flex flex-col gap-1.5">
        <button
          onClick={() => router.push("profile/edit")}
          className="text-white p-1 border border-white cursor-pointer rounded-lg hover:bg-white hover:text-dark-06 transition-all duration-400"
        >
          <Icon icon={"tabler:user-edit"} />
        </button>
        <button
          onClick={() => router.push("games")}
          className="text-white p-1 border border-white cursor-pointer rounded-lg hover:bg-white hover:text-dark-06 transition-all duration-400"
        >
          <Icon icon={"carbon:game-console"} />
        </button>
      </div>
      <AnimatePresence>
        {message.length > 0 && (
          <ErrorsWrapper>
            {message.map((c, idx) => (
              <Error
                key={`${c}-${idx}`}
                error={`${c} 0${idx}`}
                handleClose={() => setMessage((prev) => prev.splice(idx, 1))}
              />
            ))}
          </ErrorsWrapper>
        )}
      </AnimatePresence>
      <ProfileContainer flexWrap>
        <ProfileWrapper gap={0.5} col direction="fadeUp">
          <Image
            src={user?.image}
            width={48}
            height={48}
            className="rounded-full mb-2.5"
            alt={user.username + "-" + "profile"}
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
        <ProfileWrapper hFit col gap={2} animationDelay={1} direction="fadeUp">
          <h1 className="text-lg font-semibold">Challenges</h1>
          <ChallengesWrapper>
            {data.map((c) => (
              <Challenge key={c} challenge={c} />
            ))}
          </ChallengesWrapper>
          <CostumnChallenge onClick={() => router.push("/create/challenge")} />
        </ProfileWrapper>
        <ProfileWrapper
          hFit
          col
          xCenter
          gap={2.5}
          animationDelay={2}
          direction="fadeUp"
        >
          <ProfileImage src={user?.image as string} w={64} h={64} r={12} />
          <button className="cursor-pointer">Change a picture</button>
        </ProfileWrapper>
        <ProfileWrapper
          wFull
          col
          gap={2.5}
          animationDelay={3}
          direction="fadeUp"
        >
          <div className="flex justify-between">
            <Title>My Challenges</Title>
            <button
              className={clsx(
                "cursor-pointer transition hover:text-red-400",
                deleting ? "text-red-600" : "text-white/80"
              )}
              onClick={() => setDeleting((prev) => !prev)}
            >
              <Icon
                icon={deleting ? "basil:trash-solid" : "basil:trash-outline"}
              />
            </button>
          </div>
        </ProfileWrapper>
        <main className="w-full flex flex-col gap-2.5">
          <nav
            ref={navRef}
            className="flex gap-4 relative
          px-[10px] py-[5px] border-b-0 justify-around border border-white/7 rounded-lg"
            onMouseLeave={() => setHovered(null)}
          >
            {sections.map((s, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center w-full"
                onMouseEnter={(e) => handleHovered(i, e)}
                onClick={() => setSelectedSection(s.label)}
              >
                <button
                  className={clsx(
                    `
                    cursor-pointer relative px-4 py-2 text-center rounded-full 
                  text-white/70 hover:text-white transition w-full`,
                    selectedSection === s.label ? "font-medium" : "font-normal",
                    selectedSection === s.label
                      ? "bg-white/3"
                      : "bg-transparent"
                  )}
                >
                  {s.label}
                </button>
              </div>
            ))}

            <motion.div
              className="absolute bottom-0 h-0.5 bg-white/7 rounded-full"
              animate={{
                left: hovered === null ? "1%" : indicatorProps.left,
                width: hovered === null ? `98%` : indicatorProps.width,
              }}
              transition={{
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
                times: [
                  0, 0.016, 0.035, 0.106, 0.141, 0.177, 0.196, 0.216, 0.239,
                  0.266, 0.385, 0.463, 1,
                ],
              }}
            />
          </nav>
          <motion.div
            layout
            className="p-4 flex flex-wrap gap-2.5 border border-white/7 rounded-lg"
          >
            {filteredChallenges.length > 0 &&
              filteredChallenges.map((c) => (
                <ChallengeHero
                  key={`${c.id}`}
                  {...c}
                  description={
                    c.description.length > 150
                      ? `${String(c.description).slice(0, 150)}...`
                      : c.description
                  }
                  {...(c.reactionType !== "Mine"
                    ? {}
                    : {
                        ...(isEditing && { isEditing: true }),
                      })}
                  {...(c.reactionType !== "Mine"
                    ? {}
                    : {
                        ...(deleting && { isDeleting: true }),
                        callbackDelete: (id: string) => handleChallengeDel(id),
                      })}
                  isFinished={c.attempts.length > 0 ? true : false}
                ></ChallengeHero>
              ))}
          </motion.div>
          <AnimatePresence>
            {selectedSection === "My Challenges" && (
              <motion.div
                initial={{
                  y: 10,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 10,
                  opacity: 0,
                }}
                onClick={() => setIsEditing((prev) => !prev)}
                transition={{ duration: 0.45, ease: "backOut" }}
                className="flex justify-center w-full"
              >
                <DefaultButton
                  xSmall
                  icon="tabler:edit"
                  wFit
                  color="black"
                  size={17}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </ProfileContainer>
      <div className="w-full flex justify-center p-2">
        <DefaultButton
          icon="lucide:user-round-search"
          xSmall
          wFit
          color="black"
          size={17}
          onClick={() => router.push("profile/search")}
        />
      </div>
    </div>
  );
}
