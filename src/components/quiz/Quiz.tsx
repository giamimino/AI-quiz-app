import { motion } from "framer-motion";
import React from "react";

export default function Quiz({ children }: { children: string }) {
  return (
    <motion.p
      initial={{ scale: 0.7, opacity: 0, filter: "blur(10px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      className="text-white font-semibold"
    >
      {children}
    </motion.p>
  );
}
