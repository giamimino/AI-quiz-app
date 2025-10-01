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
  xCenter
}: Children & {
  col?: boolean;
  gap?: number;
  flexWrap?: boolean;
  p?: number;
  hFit?: boolean
  xCenter?: boolean
}) =>  {
  return (
    <div
      className={clsx(
        `bg-[#222222] rounded-lg w-fit hover:bg-[#1b1b1b] 
        transition duration-1000 hover:shadow-lg hover:shadow-[#1f1f1f]`,
        col ? "flex flex-col" : "flex",
        flexWrap && `flex-wrap`,
        !p && "p-5",
        hFit && "h-fit",
        xCenter && col ? "items-center" : "justify-center"
      )}
      style={{
        gap: gap ? `${gap * 4}px` : undefined,
        padding: p ? `${p * 4}px` : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default React.memo(ProfileWrapper)