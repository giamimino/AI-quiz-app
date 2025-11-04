"use client";
import HeroTitle from "@/components/Hero/hero-title";
import HeroWelcome from "@/components/Hero/hero-welcome";
import { AnimatePresence } from "framer-motion";
import WelcomeGreet from "@/components/welcome-greet";
import { ForYouContainer, ForYouWrapper } from "@/components/foryou/foryou";
import { useEffect, useRef, useState } from "react";
import { requestRandomChallenge } from "@/lib/actions/actions";
import Loading from "@/components/ui/loading/Loading";
import {
  HistoryDescription,
  HistoryTitle,
} from "@/components/templates/history-components";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

const reactions = [
  {
    icon: "mdi:heart-outline",
    type: "LIKE",
    color: "text-red-600",
    activeIcon: "mdi:heart",
  },
  {
    icon: "solar:star-line-duotone",
    type: "STAR",
    color: "text-yellow-500",
    activeIcon: "solar:star-bold",
  },
  {
    icon: "mdi:dislike-outline",
    type: "DISLIKE",
    color: "text-blue-600",
    activeIcon: "mdi:dislike",
  },
];

export default function Home() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [more, setMore] = useState(4);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  function handleSeeChallenge(challengeId: string, slug: string) {
    router.push(`/challenge/${slug}?id=${challengeId}`);
  }

  useEffect(() => {
    const scrollListener = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const targetHeight = 200;

      if (scrollTop + clientHeight >= scrollHeight - targetHeight) {
        setMore((prev) => prev + 3);
      }
    };

    document.addEventListener("scroll", scrollListener);

    return () => document.removeEventListener("scroll", scrollListener);
  }, []);

  useEffect(() => {
    if (isFetching) return;
    setIsFetching(true);
    requestRandomChallenge({
      ids: challenges.map((c) => c.id),
      take: more > 4 ? 3 : 4,
    }).then((res) => {
      if (res.success && res.challenges) {
        setChallenges((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const unique = res.challenges.filter((c) => !existingIds.has(c.id));
          
          return [...prev, ...unique]
        });
      }
      setIsFetching(false);
    });
  }, [more]);

  return (
    <div className="flex flex-col gap-5">
      <WelcomeGreet />
      <HeroWelcome>
        <AnimatePresence>
          <HeroTitle key={"Hero Title"} />
        </AnimatePresence>
      </HeroWelcome>
      <ForYouContainer>
        {challenges.map((c, index) => (
          <ForYouWrapper
            key={`${c.id}-home`}
            delay={Math.min(index * 0.1, 0.8)}
            id={c.id}
            topic={c.topic ?? "topic"}
            handleSee={() => handleSeeChallenge(c.id, c.slug)}
          >
            <HistoryTitle title={c.title} />
            <HistoryDescription description={c.description} />
            <p className="flex gap-1">
              <span className="text-white/80">Created By</span>
              <button
                className="text-white cursor-pointer"
                onClick={() =>
                  router.push(
                    `/profile/${c.creator.username}?id=${c.createdBy}`
                  )
                }
              >
                {c.creator.username}
              </button>
            </p>
            <p className="text-white/80">questions: {c._count.questions}</p>
            <span
              className="p-1 bg-gray-700 rounded-lg absolute text-white
                    right-3 top-2 max-sm:top-1.5 max-sm:right-2"
            >
              {c.type === "AI" ? (
                <Icon icon={"hugeicons:artificial-intelligence-04"} />
              ) : (
                <Icon icon={"gravity-ui:person-fill"} />
              )}
            </span>
            <div
              className="absolute bottom-5 right-5 flex gap-1.5 items-center"
            >
              {reactions.map((r) => (
                <button key={r.type} className="flex items-center gap-[2px]">
                  <Icon icon={r.icon} className={r.color} />
                  {r.type !== "DISLIKE" && <p className="text-white">{r.type === "LIKE" ? c.likes : c.favorites ?? 0}</p>}
                </button>
              ))}
            </div>
          </ForYouWrapper>
        ))}
      </ForYouContainer>
      <div className="h-5"></div>
      {isFetching && (
        <div className="p-5 relative">
          <Loading transparent />
        </div>
      )}
    </div>
  );
}
