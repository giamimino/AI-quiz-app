import { Children } from "@/app/types/global";
import { CreateChallengeWrapperProps } from "@/app/types/props";
import clsx from "clsx";
import React from "react";

export default function CreateChallengeWrapper({
  children,
  gap,
  col,
}: Children & CreateChallengeWrapperProps) {
  return (
    <div
      className={clsx("flex bg-[#1e1e1e] rounded-md p-4", col && "flex-col")}
      style={{ gap: gap ? `${gap * 4}px` : "10px" }}
    >
      {children}
    </div>
  );
}
