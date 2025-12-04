import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

export default function QuizOption({
  option,
  onClick,
  selected,
}: {
  option: string;
  onClick: (option: string) => void;
  selected: boolean;
}) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, filter: "blur(10px)", y: 10 }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
      className={clsx(
        "py-4 px-6 rounded-sm cursor-pointer hover:opacity-80",
        selected ? "bg-purple-600" : "bg-purple-500"
      )}
      onClick={() => onClick(option)}
    >
      {option}
    </motion.button>
  );
}
