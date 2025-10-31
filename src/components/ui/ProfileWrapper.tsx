import { Children } from "@/app/types/global";
import clsx from "clsx";
import React from "react";

const ProfileWrapper = ({
  children,
  col,
  gap,
  flexWrap,
  p,
  hFit,
  xCenter,
  wFull,
  rel,
  animationDelay,
  direction
}: Children & {
  col?: boolean;
  gap?: number;
  flexWrap?: boolean;
  p?: number;
  hFit?: boolean,
  wFull?: boolean,
  xCenter?: boolean,
  rel?: boolean,
  animationDelay?: number,
  direction?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight"
}) =>  {
  return (
    <div
      className={clsx(
        `bg-[#222222] rounded-lg hover:bg-[#202020] 
        transition duration-300`,
        col ? "flex flex-col" : "flex",
        flexWrap && `flex-wrap`,
        !p && "p-5",
        wFull ? "w-full" : "w-fit",
        hFit && "h-fit",
        xCenter && col && "items-center",
        xCenter && !col && "justify-center",
        rel && "relative",
        direction && direction
      )}
      style={{
        gap: gap ? `${gap * 4}px` : undefined,
        padding: p ? `${p * 4}px` : undefined,
        animationDelay: animationDelay ? `${animationDelay * 100}ms` : undefined
      }}
    >
      {children}
    </div>
  );
}

export default React.memo(ProfileWrapper)