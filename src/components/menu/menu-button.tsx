import { MenuButtonProps } from "@/app/types/props";
import { motion } from "framer-motion";
import React, { forwardRef } from "react";

const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ open, onClose, onOpen }, ref) => {
    return (
      <button
        ref={ref}
        className="w-5 h-5 p-1 flex flex-col justify-between cursor-pointer rounded-sm border-1 border-white"
        onClick={open ? onClose : onOpen}
      >
        <motion.span
          animate={{
            rotate: open ? -45 : 0,
            y: open ? 5.3 : 0,
          }}
          className="w-full h-0.5 bg-white"
        ></motion.span>
        <motion.span
          animate={{
            opacity: open ? 0 : 100,
          }}
          className="w-full h-0.5 bg-white"
        ></motion.span>
        <motion.span
          animate={{
            rotate: open ? 45 : 0,
            y: open ? -5.3 : 0,
          }}
          className="w-full h-0.5 bg-white"
        ></motion.span>
      </button>
    );
  }
);

MenuButton.displayName = "MenuButton"

export default MenuButton