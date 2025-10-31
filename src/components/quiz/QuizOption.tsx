import clsx from "clsx";
import React from "react";

export default function QuizOption({
  option,
  onClick,
  selected,
}: {
  option: string;
  onClick: (option: string) => void;
  selected: boolean
}) {
  return (
    <button className={
      clsx(
        "py-4 px-6 rounded-sm cursor-pointer hover:opacity-80",
        selected ? "bg-purple-600" : "bg-purple-500"
      )
      } onClick={() => onClick(option)}>
      {option}
    </button>
  );
}
