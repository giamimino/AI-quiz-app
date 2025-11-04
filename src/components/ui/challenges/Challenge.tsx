import { useRouter } from "next/navigation";
import React from "react";

export default function Challenge({ challenge }: { challenge: string }) {
  const router = useRouter()
  return (
    <div
      className="px-3 py-1.5 bg-purple-600 rounded-sm select-none cursor-pointer
      hover:bg-purple-500 transition"
      onClick={() => router.push(`/challenge/search?topic=${challenge}`)}
    >
      {challenge}
    </div>
  );
}
