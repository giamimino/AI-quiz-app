import React from "react";

export default function Challenge({ challenge }: { challenge: string }) {
  return (
    <div
      className="px-3 py-1.5 bg-purple-600 rounded-sm select-none cursor-pointer
      hover:bg-purple-500 transition"
    >
      {challenge}
    </div>
  );
}
