"use client";
import { Challenge } from "@/app/types/global";
import {
  HistoryContianer,
  HistoryDescription,
  HistoryTitle,
  HistoryWrapper,
} from "@/components/templates/history-components";
import TopicsFilterWrapper from "@/components/topics-filter-wrapper";
import Search from "@/components/ui/default-serch";
import Loading from "@/components/ui/loading/Loading";
import { useDebounce } from "@/hooks/useDebounce";
import {
  RequestTopics,
  searchChallenge,
  searchTopic,
} from "@/lib/actions/actions";
import { useTopicStore } from "@/zustand/useTopicStore";
import { Icon } from "@iconify/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const router = useRouter();
  const [showFilter, closeFilter] = useState(false);
  const { setTopics, pushTopic } = useTopicStore();

  const filteredChallenges = useMemo(() => {
    if (!challenges) return;
    let result = challenges;

    if (selectedTopics.length !== 0) {
      result = result?.filter((c) => selectedTopics.includes(c.topic ?? ""));
    }

    if (debouncedSearch.trim()) {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    return result;
  }, [debouncedSearch, challenges, selectedTopics]);

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
    const topic = searchParams.get("topic") ?? null;
    if (!topic) return;

    searchTopic({ topic }).then((res) => {
      if (res.success && res.challanges) {
        setChallenges(res.challanges);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (challenges.length > 0) return;
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [challenges]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await searchChallenge({
          query: debouncedSearch.toLowerCase(),
          ids: challenges.map((c) => c.id) ?? [],
          topics: selectedTopics ?? [],
        });

        if (res.success && res.challanges) {
          setChallenges((prev) => [...prev, ...res.challanges]);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          return;
        }
      }
    })();

    return () => controller.abort();
  }, [debouncedSearch]);

  useEffect(() => {
    if (selectedTopics.length === 0 && !showFilter) return;
    RequestTopics().then((res) => {
      if (res.success && res.popularTopics) {
        setTopics(res.popularTopics);
      }
    });
  }, [showFilter]);

  if (loading) return <Loading />;

  function handleSeeChallenge(challengeId: string, slug: string) {
    router.push(`/challenge/${slug}?id=${challengeId}`);
  }

  function handleTopicSelect({
    topic,
    type,
  }: {
    topic: string;
    type: "unselect" | "select";
  }) {
    setSelectedTopics((prev) =>
      type === "select"
        ? prev.includes(topic)
          ? prev
          : [...prev, topic]
        : prev.filter((t) => t !== topic)
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-2 items-center relative">
        <h1 className="text-white">Search For Challenges</h1>
        <div className="flex gap-3 items-center relative">
          <Search
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            onClick={() => closeFilter((prev) => !prev)}
            className="text-white p-1 border border-white h-fit cursor-pointer z-102 rounded-lg"
          >
            <Icon icon={"solar:filter-linear"} />
          </button>
        </div>
        <AnimatePresence>
          {showFilter && (
            <TopicsFilterWrapper
              selectedTopics={selectedTopics}
              callbackSelect={handleTopicSelect}
            />
          )}
        </AnimatePresence>
      </div>
      <HistoryContianer>
        {filteredChallenges?.map((h, index) => (
          <HistoryWrapper
            key={h.id}
            col
            delay={Math.min(index * 0.1, 0.8)}
            id={h.id}
            topic={h.topic ?? "topic"}
            handleSee={() => handleSeeChallenge(h.id, h.slug)}
          >
            <HistoryTitle title={h.title} />
            <HistoryDescription description={h.description} />
            <p className="flex gap-1">
              <span className="text-white/80">Created By</span>
              <button
                className="text-white cursor-pointer"
                onClick={() =>
                  router.push(
                    `/profile/${h.creator.username}?id=${h.createdBy}`
                  )
                }
              >
                {h.creator.username}
              </button>
            </p>
            <span
              className="p-1 bg-gray-700 rounded-lg absolute text-white
                    right-3 top-2 max-sm:top-1.5 max-sm:right-2"
            >
              {h.type === "AI" ? (
                <Icon icon={"hugeicons:artificial-intelligence-04"} />
              ) : (
                <Icon icon={"gravity-ui:person-fill"} />
              )}
            </span>
          </HistoryWrapper>
        ))}
      </HistoryContianer>
    </div>
  );
}
