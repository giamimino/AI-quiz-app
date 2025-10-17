import { ChallangeHeroProps } from "@/app/types/props";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

const ChallengeHero = ({
  id,
  title,
  slug,
  description,
  topic,
  type,
  isDeleting,
  callbackDelete,
}: ChallangeHeroProps) => {
  const router = useRouter()

  return (
    <div
      className="p-3 relative flex flex-col gap-1.5 
    bg-neutral-800 rounded-sm cursor-pointer min-w-50 max-w-90
    [&_p]:text-white/60 [&_p]:text-wrap"
      onClick={() => router.push(`/challenge/${slug}?id=${id}`)}
    >
      <div className="absolute top-2 right-2 flex gap-1.5">
        <AnimatePresence initial={false}>
          {isDeleting && (
            <motion.button
              className="p-1 bg-red-300/20 rounded-lg cursor-pointer hover:text-red-600"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{opacity: 0, y: 1}}
              {...(callbackDelete ? {
                onClick: () => callbackDelete(id)
              } : {})}
            >
              <Icon icon={"basil:trash-outline"} />
            </motion.button>
          )}
        </AnimatePresence>
        <span className="p-1 bg-gray-700 rounded-lg">
          {type === "AI" ? (
            <Icon icon={"hugeicons:artificial-intelligence-04"} />
          ) : (
            <Icon icon={"gravity-ui:person-fill"} />
          )}
        </span>
      </div>
      <h1 className="text-nowrap font-semibold">{title}</h1>
      <p>{description}</p>
      {topic && <h2 className="text-white">#{topic}</h2>}
    </div>
  );
};

export default React.memo(ChallengeHero);
