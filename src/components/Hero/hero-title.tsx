import React from "react";
import { motion } from "framer-motion";

export default function HeroTitle() {
  return (
    <motion.div
      animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0)" }}
      initial={{ y: 40, opacity: 0, scale: 1.2, filter: "blur(3px)" }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className="text-white font-semibold flex gap-1"
    >
      <span>
        Quizzes That
      </span>
      <motion.span
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          y: [0, -10, 0],
          rotateX: [0, 360, 0],
        }}
        transition={{
            duration: 1.5,
            ease: "backOut",
            repeat: Infinity,
            repeatDelay: 2,
        }}
        className="block font-bold"
      >
        Learn
      </motion.span>
      <span>With</span>
      <motion.span
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          y: [0, -10, 0],
          rotateX: [0, 360, 0],
        }}
        transition={{
            duration: 1.5,
            ease: "backOut",
            repeat: Infinity,
            repeatDelay: 1,
        }}
        className="block font-bold"
      >
         You
      </motion.span>.
    </motion.div>
  );
}
