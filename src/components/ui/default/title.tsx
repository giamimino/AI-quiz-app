import { Children } from "@/app/types/global";
import clsx from "clsx";
import React from "react";

export default function Title({
  children,
  xLeft,
  xCenter,
}: Children & { xLeft?: boolean, xCenter?: boolean }) {
  return (
    <h1
      className={clsx("text-lg font-semibold text-white", xLeft && "text-left", xCenter && "text-center")}
    >
      {children as string}
    </h1>
  );
}
