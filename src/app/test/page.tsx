"use client";
import PlayersWelcome from "@/components/ui/animations/players-welcome";
import QuestionsGenerating from "@/components/ui/animations/questions-generating";
import WinnerGreet from "@/components/ui/animations/winner-greet";
import React from "react";

export default function page() {
  return (
    <div>
      <WinnerGreet
        winner="1"
        players={{
          pl1: {
            id: "oidjoiwqj92882u98",
            image: "https://cdn.discordapp.com/embed/avatars/0.png",
            name: "saba",
          },
          pl2: {
            id: "1",
            image: "https://cdn.discordapp.com/embed/avatars/0.png",
            name: "gia",
          },
        }}
      />
    </div>
  );
}
