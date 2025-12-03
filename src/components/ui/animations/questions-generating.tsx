"use client";
import { motion } from "framer-motion";
import React from "react";

export default function QuestionsGenerating() {
  return (
    <div className="absolute w-full h-full top-0 left-0 bg-stone-950 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
        exit={{ scale: 0, opacity: 0 }}
        className="flex gap-1 items-center"
      >
        <h1 className="text-white text-2xl font-bold">Generating</h1>
        <div className="flex flex-row gap-1 self-end pb-0.5">
          <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </motion.div>
    </div>
  );
}
