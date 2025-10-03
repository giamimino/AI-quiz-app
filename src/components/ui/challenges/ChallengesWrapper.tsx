import { Children } from "@/app/types/global";
import clsx from "clsx";
import React from "react";

export default function ChallengesWrapper({
  children,
  gap,
  col,
  xCenter,
  YCenter
}: Children & { gap?: number, col?:boolean, xCenter?:boolean, YCenter?: boolean }) {
  return (
    <div className={clsx(
      "flex min-w-68",
      col ? "flex-col" : "flex-wrap",
      xCenter && "justify-center",
      YCenter && "items-center"
    )}
    style={{gap: gap ? `${gap * 4}px` : "10px"}}>
      {children}
    </div>
  );
}
