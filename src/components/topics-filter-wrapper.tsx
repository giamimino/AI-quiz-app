import React from "react";
import Loading from "./ui/loading/Loading";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTopicStore } from "@/zustand/useTopicStore";

export default function TopicsFilterWrapper({
  selectedTopics,
  callbackSelect,
}: {
  selectedTopics: string[];
  callbackSelect: ({
    topic,
    type,
  }: {
    topic: string;
    type: "unselect" | "select";
  }) => void;
}) {
  const { topics } = useTopicStore();

  function handleSelect({ topic }: { topic: string; }) {
    if (selectedTopics.includes(topic)) {
      callbackSelect({ topic, type: "unselect" });
      return;
    }

    callbackSelect({ topic, type: "select" });
  }
  return (
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
      transition={{ duration: 0.45, ease: "backOut" }}
      className={clsx(
        "rounded-xl bg-neutral-800 absolute top-[120%] min-w-1/6 max-w-1/4 min-h-20 z-2",
        topics.length !== 0 && "p-2.5"
      )}
    >
      {topics?.length === 0 && (
        <div className="relative overflow-hidden rounded-xl w-full h-25">
          <Loading />
        </div>
      )}

      {topics?.length !== 0 && (
        <div className="flex flex-wrap gap-2.5">
          {topics.map((t, idx) => (
            <button
              onClick={() => handleSelect({ topic: t.topic })}
              className={clsx(
                "px-1 py-0.5 border rounded-md cursor-pointer hover:text-white/80",
                selectedTopics.includes(t.topic)
                  ? "text-white border-white/30"
                  : "text-white/70 border-white/6"
              )}
              key={`${t.challengeId}-topic`}
            >
              {t.topic}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
