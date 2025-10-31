import { Icon } from "@iconify/react";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function SearchButton({
  ...rest
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button {...rest} className="text-white p-1 border border-white cursor-pointer z-102 rounded-lg absolute top-2 left-2">
      <Icon icon={"iconamoon:search-bold"} />
    </button>
  );
}
