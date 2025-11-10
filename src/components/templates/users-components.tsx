import { Children } from "@/app/types/global";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function UsersContainer({ children }: Children) {
  return <main className="flex flex-wrap gap-2.5">{children}</main>;
}

export function UserWrapper({
  username,
  joined,
  image,
}: {
  username: string;
  joined: string;
  image: string | null;
}) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ y: 20, filter: "blur(10px)", opacity: 0 }}
      animate={{ y: 0, filter: "blur(0)", opacity: 100 }}
      transition={{ delay: 0.05 + Math.random() * 0.3, duration: 0.4 }}
      className="border border-white/7 p-5 flex-4 bg-neutral-900 rounded-lg flex gap-2.5 items-center relative"
    >
      {image && (
        <Image
          src={image}
          width={48}
          height={48}
          alt={username}
          className="rounded-2xl"
        />
      )}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-white font-medium text-lg">{username}</h1>
        <p className="text-white/70">Joined {joined}</p>
      </div>
      <button
        onClick={() => router.push(`/profile/${username}`)}
        className="absolute transition right-5 text-white text-xl cursor-pointer p-1 border border-white/7 rounded-lg hover:bg-neutral-800"
      >
        <Icon icon={"mdi-light:eye"} />
      </button>
    </motion.div>
  );
}
