import React from "react";

export default function QuizOption({
  option,
  onClick,
}: {
  option: string;
  onClick: (option: string) => void;
}) {
  return (
    <button className="py-4 px-6 bg-purple-500 rounded-sm cursor-pointer hover:opacity-80" onClick={() => onClick(option)}>
      {option}
    </button>
  );
}
