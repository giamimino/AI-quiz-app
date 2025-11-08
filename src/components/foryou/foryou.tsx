import { Children } from "@/app/types/global";
import { motion } from "framer-motion";
import DefaultButton from "../ui/default-button";

export function ForYouContainer({ children }: Children) {
  return <main className="flex flex-col gap-2.5 w-full px-1">{children}</main>;
}

export function ForYouWrapper({
  children,
  delay,
  topic,
  handleSee,
}: Children & {
  delay: number;
  topic: string;
  handleSee: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0, filter: "blur(5px)" }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col gap-1 w-full p-5 items-center rounded-sm bg-[#1b1b1b]"
    >
      {children}
      <p className="text-white">#{topic}</p>
      <DefaultButton label="See" noSelect wFit onClick={() => handleSee()} />
    </motion.div>
  );
}

export function ForYouDescription({
  description,
}: {
  description: string | null;
}) {
  return <p className="text-white/80 font-medium">{description}</p>;
}
