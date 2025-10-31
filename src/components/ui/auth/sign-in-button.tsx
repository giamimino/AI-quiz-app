import { login } from "@/lib/actions/auth";
import { Icon } from "@iconify/react";
import React from "react";

export default function SignInButton({ provider }: { provider: "github" }) {
  return (
    <button
      onClick={() => login(provider)}
      className="flex gap-1.5 items-center cursor-pointer transition
      hover:[&_span]:text-white/90 border-1 border-[#242424] py-2 px-3 rounded-sm 
      hover:border-white focus:ring-2 focus:ring-white focus:ring-offset-4
      focus:ring-offset-[#181818]"
    >
      <Icon icon={"mdi:github"} className="text-white" />
      <span className="text-white/70">Continue with Github</span>
    </button>
  );
}
