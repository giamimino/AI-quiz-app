import { SearchProps } from "@/app/types/props";
import React from "react";

export default function Search({ value, onChange }: SearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-fit focus:outline-none text-white p-1 border-1 border-white rounded-sm
      focus:ring-2 focus:ring-white focus:ring-offset-3 transition focus:ring-offset-[#181818] "
    />
  );
}