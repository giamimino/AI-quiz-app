import { DefaultButtonProps } from "@/app/types/props";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function DefaultButton({
  label,
  bg,
  hoverBg,
  wFit,
  small,
  font,
  mCenter,
  icon,
  noSelect,
  fixed,
  tlCorner,
  trCorner,
  size,
  xSmall,
  ...rest
}: DefaultButtonProps &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      className={clsx(
        "rounded-md cursor-pointer text-black",
        bg ? `bg-${bg}` : "bg-amber-50",
        hoverBg ? `hover:bg-${hoverBg}` : "hover:bg-purple-200",
        wFit && "w-fit",
        xSmall && "p-2 text-[10px]",
        small && "px-2 py-1.5 text-xs",
        !small && !xSmall && "px-3 py-2",
        noSelect && "select-none",
        mCenter && "mx-auto",
        fixed && "fixed",
        tlCorner && "top-4 left-4",
        trCorner && "top-4 right-4",
      )}
      style={{
        fontWeight: font ? font : "",
      }}
      {...rest}
    >
      {label && <span>{label}</span>}
      {icon && <Icon icon={icon} style={{width: size && `${size}px`, height: size && `${size}px`}} />}
    </button>
  );
}
