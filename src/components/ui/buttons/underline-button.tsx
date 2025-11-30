import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function UnderlineButton({
  label,
  noTextColor,
  ...rest
}: { label: string, noTextColor?:boolean} &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      className={clsx(
        "cursor-pointer transition underline",
        !noTextColor && 'text-white hover:text-grey-70'
      )}
      {...rest}
    >
      {label}
    </button>
  );
}
