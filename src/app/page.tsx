"use client"
import HeroTitle from "@/components/Hero/hero-title";
import HeroWelcome from "@/components/Hero/hero-welcome";
import { AnimatePresence } from "framer-motion";
import QuizFetcher from "@/components/quiz/QuizFetcher";

export default function Home() {

  return (
    <div className="flex flex-col gap-5">
      <HeroWelcome>
        <AnimatePresence>
          <HeroTitle />
        </AnimatePresence>
      </HeroWelcome>
      <QuizFetcher />
    </div>
  );
}
