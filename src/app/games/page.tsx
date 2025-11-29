"use client";
import DefaultTitle from "@/components/ui/default/default-title";
import DefaultWrapper from "@/components/ui/default/default-wrapper";
import PrimaryButton from "@/components/ui/primary/primary-button";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React from "react";

export default function GamesPage() {
  const router = useRouter()
  return (
    <div className="p-8">
      <DefaultWrapper noBorder col gap={2.5}>
        <div className="flex gap-2.5 items-center pl-4">
          <DefaultTitle title="Games" text={18} font="600" />
          <PrimaryButton icon="mingcute:arrow-down-fill" />
        </div>
        <DefaultWrapper wFit dFlex gap={4.5} p={{ p: 4.5 }}>
          <GameWrapper title="QuickClash" className="bg-dark-06 text-grey-70" onClick={() => router.push("/games/quickclash")} />
        </DefaultWrapper>
      </DefaultWrapper>
    </div>
  );
}

function GameWrapper({
  title,
  className,
  onClick,
}: {
  title: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "border border-dark-15 rounded-lg w-fit px-7 py-5 select-none cursor-pointer font-medium text-lg hover:opacity-80",
        className
      )}
    >
      <span>{title}</span>
    </div>
  );
}
