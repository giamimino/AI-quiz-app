import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function CostumnChallenge({
  ...rest
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className="px-3 py-1.5 bg-gray-600 rounded-sm select-none cursor-pointer
      hover:bg-gray-500 transition"
      {...rest}
    >
      Custome
    </button>
  );
}
