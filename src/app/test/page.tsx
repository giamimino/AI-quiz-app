"use client";
import PlayersWelcome from "@/components/ui/animations/players-welcome";
import React from "react";

export default function page() {
  return (
    <div>
      <PlayersWelcome
        thisPl={{
          name: "gia",
          thumb:
            "https://cdn.discordapp.com/avatars/1178428125529505863/d707c7cef94e044000458c4bb4959282.png",
        }}
        players={{
          pl1: {
            name: "saba",
            thumb: "https://cdn.discordapp.com/embed/avatars/0.png",
          },
          pl2: {
            name: "oto",
            thumb: "https://avatars.githubusercontent.com/u/240321559?v=4"
          },
          pl3: {
            name: "luke",
            thumb: "https://avatars.githubusercontent.com/u/240321559?v=4"
          },
          pl4: {
            name: "gio",
            thumb: "https://avatars.githubusercontent.com/u/240321559?v=4"
          }
        }}
      />
    </div>
  );
}
