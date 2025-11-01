import { ChallangeHeroProps } from "@/app/types/props";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

const ChallengeHero = ({
  id,
  title,
  slug,
  description,
  topic,
  type,
  isDeleting,
  callbackDelete,
  isFinished,
  isEditing,
}: ChallangeHeroProps) => {
  const router = useRouter();
  const deleteRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent) {
    if (
      deleteRef.current &&
      deleteRef.current.contains(e.target as Node) &&
      callbackDelete &&
      !isEditing
    ) {
      callbackDelete(id);
    } else if (isEditing) {
      router.push(`/profile/edit/${slug}?id=${encodeURIComponent(id)}`);
    } else {
      router.push(`/challenge/${slug}?id=${id}`);
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0)" }}
      exit={{ opacity: 0 }}
      layout
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-3 relative flex flex-col gap-1.5 
    bg-neutral-800 rounded-sm cursor-pointer min-w-50 max-w-90
    [&_p]:text-white/60 [&_p]:text-wrap hover:bg-neutral-800/80"
      onClick={(e) => handleClick(e)}
    >
      <div className="absolute top-2 right-2 flex gap-1.5">
        <AnimatePresence initial={false}>
          {isDeleting && (
            <motion.button
              key={"delete-button"}
              ref={deleteRef}
              layout
              className="p-1 bg-red-300/20 rounded-lg cursor-pointer hover:text-red-600"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, y: 1 }}
              {...(callbackDelete
                ? {
                    onClick: () => callbackDelete(id),
                  }
                : {})}
            >
              <Icon icon={"basil:trash-outline"} />
            </motion.button>
          )}
          {isEditing && (
            <motion.button
              layout
              key={"editing-button"}
              className="p-1 bg-white/5 border border-white/7 rounded-lg cursor-pointer hover:border-white"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, y: 1 }}
            >
              <Icon icon={"lets-icons:edit"} />
            </motion.button>
          )}
        </AnimatePresence>
        <span className="p-1 bg-gray-700 rounded-lg text-white">
          {type === "AI" ? (
            <Icon icon={"hugeicons:artificial-intelligence-04"} />
          ) : (
            <Icon icon={"gravity-ui:person-fill"} />
          )}
        </span>
      </div>
      <h1 className="text-nowrap font-semibold text-white">{title}</h1>
      <p>{description}</p>
      {topic && <h2 className="text-white">#{topic}</h2>}
      {isFinished && (
        <span className="text-orange-600 absolute bottom-3 right-3 font-medium line-through">
          Finished
        </span>
      )}
    </motion.div>
  );
};

export default React.memo(ChallengeHero);
