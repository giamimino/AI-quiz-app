import { Children } from "@/app/types/global";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import DefaultButton from "../ui/default-button";
import { motion } from "framer-motion";

export function HistoryContianer({ children }: Children) {
  return (
    <main className="flex gap-2.5 flex-col py-4 px-8 max-sm:px-3 max-sm:py-1">
      {children}
    </main>
  );
}

export const HistoryWrapper = ({
  children,
  col,
  finishedIn,
  topic,
  score,
  handleDelete,
  id,
  delay,
  handleResult,
  handleSee,
}: Children & {
  id: string;
  col?: boolean;
  finishedIn?: number | boolean;
  topic: string;
  score?: number;
  handleDelete?: (attemptId: string) => void;
  handleResult?: (attemptId: string) => void;
  handleSee?: () => void
  delay: number;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)", y: 10 }}
      animate={show ? { opacity: 1, filter: "blur(0)", y: 0 } : {}}
      exit={{ opacity: 0, filter: "blur(5px)", y: 10 }}
      transition={{ duration: 0.6, delay }}
      ref={wrapperRef}
      className={clsx(
        `flex px-3 py-2 max-sm:py-1.5 max-sm:px-2 gap-1 border border-white rounded-lg`,
        col && "flex-col"
      )}
    >
      {children}
      <div className="flex flex-col">
        {finishedIn && (
          <p>
            <span className="text-white/90 font-medium">Time:</span>{" "}
            <span className="text-white/70">{finishedIn}s</span>
          </p>
        )}
        {score !== 0 && score && (
          <p>
            <span className="text-white/90 font-medium">Score:</span>{" "}
            <span className="text-white/70">{score}</span>
          </p>
        )}
        <p className="text-white">#{topic}</p>
      </div>
      {handleDelete && handleResult && (
        <div className="flex gap-2.5">
          <DefaultButton
            label="Delete"
            noSelect
            wFit
            onClick={() => handleDelete(id)}
          />
          <DefaultButton
            label="See Result"
            noSelect
            wFit
            onClick={() => handleResult(id)}
          />
        </div>
      )}
      {handleSee && (
        <DefaultButton
            label="See"
            noSelect
            wFit
            onClick={() => handleSee()}
          />
      )}
    </motion.div>
  );
};

export function HistoryTitle({ title }: { title: string }) {
  return <h1 className="text-white text-2xl font-semibold">{title}</h1>;
}

export function HistoryDescription({
  description,
}: {
  description: string | null;
}) {
  return <p className="text-white/80 font-medium">{description}</p>;
}
