import { Children } from "@/app/types/global";
import clsx from "clsx";
import React from "react";

export default function ProfileContainer({
  children,
  flex,
  col,
  grid,
  flexWrap
}: Children & { flex?: boolean; col?: boolean; grid?: boolean, flexWrap?:boolean }) {
  return (
    <div
      className={clsx(
        "gap-2.5",
        flex && "flex",
        grid && "grid grid-cols-2",
        col && "flex flex-col",
        flexWrap && "flex flex-wrap"
      )}
    >
      {children}
    </div>
  );
}
