import { logout } from "@/lib/actions/auth";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function MenuOpen({
  closeMenu,
  buttonRef,
}: {
  closeMenu: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const pages = [
    {
      label: "Menu",
      url: "/",
    },
    {
      label: "profile",
      url: "/profile",
    },
    {
      label: "statistic",
      url: "/statistic",
    }
  ];

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        buttonRef?.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [ref, buttonRef]);
  return (
    <motion.div
      ref={ref}
      initial={{
        y: 10,
        opacity: 0,
        boxShadow: "0px 0px 0px rgba(255,255,255,0)",
      }}
      animate={{
        y: 0,
        opacity: 1,
        boxShadow: "0px 8px 25px rgba(255,255,255,0.05)",
      }}
      exit={{
        y: 10,
        opacity: 0,
        boxShadow: "0px 0px 0px rgba(255,255,255,0)",
      }}
      transition={{ duration: 0.45, ease: "backOut" }}
      className="absolute -bottom-[240%] select-none bg-[#242424] px-4 py-2 rounded-[3px]
      flex flex-col gap-1  
      items-center [&_button]:transition [&_>button]:hover:text-white/90 [&_button]:cursor-pointer z-99"
    >
      {pages.map((p, index) => (
        <button
          key={`${p.label}-${p.url}-${index}`}
          className={pathname === p.url ? "text-white" : "text-white/70"}
          onClick={() => router.push(p.url)}
        >
          {p.label}
        </button>
      ))}
      <span>
        <button
          className="text-white/70 hover:text-red-600/70"
          onClick={() => logout()}
        >
          logout
        </button>
      </span>
    </motion.div>
  );
}
