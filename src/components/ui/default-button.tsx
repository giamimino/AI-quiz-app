import { DefaultButtonProps } from "@/app/types/props";
import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function DefaultButton({
  label,
  bg,
  hoverBg,
  ...rest
}: DefaultButtonProps &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      className={clsx(
        "px-3 py-2 rounded-md cursor-pointer",
        bg ? `bg-${bg}` : "bg-amber-50",
        hoverBg ? `hover:bg-${hoverBg}` : "hover:bg-purple-200"
      )}
      {...rest}
    >
      {label}
    </button>
  );
}
