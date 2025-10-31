import { Children } from "@/app/types/global";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function ResultsContainer({ children }: Children) {
  return <main className="flex flex-col gap-2.5 p-2.5">{children}</main>;
}

export function ResultWrapper({
  children,
  index,
}: Children & { index: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting) {
          setShow(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if(wrapperRef.current) {
      observer.observe(wrapperRef.current)
    }

    return () => observer.disconnect()
  }, [])
  return (
    <motion.div
      ref={wrapperRef}
      initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
      animate={show ? { y: 0, opacity: 1, filter: "blur(0)" } : {}}
      transition={{ delay: Math.min(index * 0.1, 0.8), duration: 0.7, ease: "easeInOut" }}
      className="relative flex flex-col gap-2 p-5 rounded-lg border 
      border-white/11 hover:shadow hover:shadow-amber-50 transition-all duration-500 hover:py-7"
    >
      {children}
    </motion.div>
  );
}

export function ResultQuestion({ question, index }: { question: string, index: number }) {
  return (
    <h1 className="text-white text-lg">{index + 1}. {question}</h1>
  )
}

export function ResultOption({ option, isCorrect }: { option: string, isCorrect: boolean }) {
  return (
    <p className={clsx(
      "",
      isCorrect ? "text-green-600" : "text-red-600"
    )}>
      {option}
    </p>
  )
}
