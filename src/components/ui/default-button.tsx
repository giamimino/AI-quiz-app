import { DefaultButtonProps } from "@/app/types/props";
import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function DefaultButton({
  label,
  bg,
  hoverBg,
  wFit,
  small,
  font,
  ...rest
}: DefaultButtonProps &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      className={clsx(
        "rounded-md cursor-pointer",
        bg ? `bg-${bg}` : "bg-amber-50",
        hoverBg ? `hover:bg-${hoverBg}` : "hover:bg-purple-200",
        wFit && "w-fit",
        small ? "px-2 py-1.5 text-xs" : "px-3 py-2",
      )}
      style={{fontWeight: font ? font : ""}}
      {...rest}
    >
      {label}
    </button>
  );
}
