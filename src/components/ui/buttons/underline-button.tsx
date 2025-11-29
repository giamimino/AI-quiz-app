import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function UnderlineButton({
  label,
  ...rest
}: { label: string} &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) {
  return (
    <button
      className={clsx(
        "cursor-pointer text-white hover:text-grey-70 transition underline",
      )}
      {...rest}
    >
      {label}
    </button>
  );
}
