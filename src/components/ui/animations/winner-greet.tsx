import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function WinnerGreet({
  players,
  winner,
  onEnd,
}: {
  players: Record<string, { id: string; image: string; name: string }>;
  winner: string;
  onEnd: () => void;
}) {
  const [show, setShow] = useState(true);
  const otherPlayers = Object.values(players);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onEnd();
    }, 2.7 * 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <AnimatePresence>
        {show && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
          >
            <div className="flex flex-col gap-2.5 justify-center">
              <div className="p-1 flex flex-col justify-center">
                <motion.h1
                  initial={{ scale: 2, opacity: 0, filter: "blur(2px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  exit={{
                    scale: 0.5,
                    opacity: 0,
                    filter: "blur(10px)",
                    x: -20,
                  }}
                  className="text-xl font-bold text-white"
                >
                  Players
                </motion.h1>

                <motion.div
                  className="h-1 bg-white/50 rounded-full"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 150, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1] }}
                />
              </div>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.17,
                    },
                  },
                }}
                className="flex gap-4 justify-center"
              >
                {otherPlayers.map((player, i) => (
                  <motion.div
                    key={player.name + i}
                    exit={{ scale: 0.9 }}
                    animate={player.id === winner ? "winner" : "show"}
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: 60,
                        scale: 0.9,
                        filter: "blur(8px)",
                      },
                      show: {
                        opacity: 1,
                        x: 0,
                        scale: [1, 1, 0.8],
                        filter: "blur(0)",
                        transition: {
                          duration: 1.6,
                          ease: [0.33, 1, 0.68, 1],
                          times: [0, 0.6, 1],
                        },
                      },
                      winner: {
                        opacity: 1,
                        x: 0,
                        filter: "blur(0)",
                        scale: [1, 1, 1.2],
                        transition: {
                          duration: 1.6,
                          times: [0, 0.6, 1],
                          ease: [0.33, 1, 0.68, 1],
                        },
                      },
                      exit: {
                        opacity: 0,
                        x: 60,
                        scale: 0.9,
                      },
                    }}
                    className="flex items-center relative justify-center gap-3 p-2"
                  >
                    {player.image.trim() && (
                      <Image
                        src={player.image}
                        width={60}
                        height={60}
                        alt={`${player.name}-thumb`}
                        className="rounded-xl z-1"
                      />
                    )}
                    {player.id === winner && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          scale: 0.3,
                          filter: "blur(5px)",
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          filter: "blur(0)",
                          y: 50,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0,
                          filter: "blur(5px)",
                          y: 0,
                        }}
                        transition={{ delay: 1, ease: [0.33, 1, 0.68, 1] }}
                        className="text-2xl text-white font-extrabold absolute"
                      >
                        win
                      </motion.span>
                    )}
                    <motion.span
                      initial={{
                        opacity: 0,
                        x: "-100%",
                        scale: 0,
                        filter: "blur(10px)",
                      }}
                      exit={{ opacity: 0, x: "-100%", scale: 0 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: "blur(0)",
                      }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-white text-xl font-semibold"
                    >
                      {player.name}
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
