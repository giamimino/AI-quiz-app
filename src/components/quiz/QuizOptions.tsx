import React from "react";

export default function QuizOptions({
  children,
  gap,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <div
      className="grid grid-cols-3"
      style={{ gap: gap ? `${gap * 4}px` : "10px" }}
    >
      {children}
    </div>
  );
}
