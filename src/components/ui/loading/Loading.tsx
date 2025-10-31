import clsx from "clsx";
import React from "react";

export default function Loading({ transparent }: { transparent?: boolean }) {
  return (
    <div
      className={clsx(
        "w-full h-full z-99 top-0 left-0 flex justify-center items-center absolute inset-0",
        transparent ? "bg-transparent" : "bg-black/80"
      )}
    >
      <div
        className="w-10 h-10 border-2 border-t-black 
      border-gray-300 rounded-full animate-spin"
      ></div>
    </div>
  );
}
