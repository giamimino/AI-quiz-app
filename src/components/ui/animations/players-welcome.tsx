import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function PlayersWelcome({
  players,
  thisPl,
  handleStop,
}: {
  thisPl: { name: string; thumb: string };
  players: Record<string, { name: string; thumb: string }>;
  handleStop: () => void;
}) {
  const [stop, setStop] = useState(false);
  const otherPlayers = Object.values(players);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStop(true);
      handleStop();
    }, 2.7 * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!stop && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
            className="fixed inset-0 bg-stone-900 flex items-center justify-center overflow-hidden z-102"
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />

            <div className="relative flex items-center gap-10">
              <motion.div
                initial={{ opacity: 0, x: -60, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.8 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
                className="flex items-center gap-3"
              >
                <span className="text-white text-3xl font-bold">You</span>
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -15 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                >
                  <Image
                    src={thisPl.thumb}
                    width={70}
                    height={70}
                    alt="you-thumb"
                    className="rounded-xl"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="w-1 bg-white/50 rounded-full"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 150, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1] }}
              />

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
                className="flex flex-col gap-4"
              >
                {otherPlayers.map((player, i) => (
                  <motion.div
                    key={player.name + i}
                    exit={{ scale: 0.9 }}
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
                        scale: 1,
                        filter: "blur(0)",
                        transition: {
                          duration: 0.6,
                          ease: [0.33, 1, 0.68, 1],
                        },
                      },
                      exit: {
                        opacity: 0,
                        x: 60,
                        scale: 0.9,
                      },
                    }}
                    className="flex items-center gap-3"
                  >
                    {player.thumb.trim() && (
                      <Image
                        src={player.thumb}
                        width={60}
                        height={60}
                        alt={`${player.name}-thumb`}
                        className="rounded-xl z-1"
                      />
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
    </>
  );
}
