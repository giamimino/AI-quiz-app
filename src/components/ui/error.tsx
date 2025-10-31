import { ErrorProps } from "@/app/types/props";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React, { useEffect } from "react";

export default function Error({ error, handleClose }: ErrorProps) {
  useEffect(() => {
    const timer = setTimeout(() => handleClose(error), 3500)
    return () => clearTimeout(timer)
  }, [])
  return (
    <motion.div
      layout
      initial={{ y: -70, opacity: 0 }}
      exit={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "anticipate" }}
      className="py-3 px-5 bg-neutral-800 rounded-xl flex gap-2.5 items-center
        [&_button]:text-red-600 [&_button]:cursor-pointer 
        [&_p]:text-white max-w-80"
    >
      <p>{error}</p>
      <button onClick={() => handleClose(error)}>
        <Icon icon={"mingcute:close-fill"} />
      </button>
    </motion.div>
  );
}
