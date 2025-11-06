import { Children } from "@/app/types/global";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

type Props<T extends "div" | "form" = "div"> = {
  type?: T;
  children: React.ReactNode;
} & (T extends "form"
  ? React.HTMLAttributes<HTMLFormElement>
  : React.HTMLAttributes<HTMLDivElement>);

export const EditWrapper = React.memo(
  <T extends "div" | "form" = "div">({
    children,
    type,
    ...props
  }: Props<T>) => {
    const Tag = (type ?? "div") as any;
    return (
      <Tag
        className="flex flex-col w-full p-2.5 border border-white/20 rounded-md bg-neutral-800/20"
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

export const FormWrapper = ({
  value,
  label,
  onChange,
  type,
  as,
  name,
  suggestedValue,
  clearSugestedValue,
  wFull
}: {
  label: string;
  value: string;
  type: "input" | "textarea";
  onChange: (value: string) => void;
  as?: string;
  name?: string;
  suggestedValue?: string;
  clearSugestedValue?: () => void;
  wFull?: boolean
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        clearSugestedValue?.();
      }
    }

    if (suggestedValue) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [suggestedValue, clearSugestedValue]);
  return (
    <div
      ref={wrapperRef}
      className={clsx(
        "flex flex-col gap-1 relative",
        type === "textarea" && "flex-col justify-center",
      )}
    >
      <label className="text-white cursor-text">{label}</label>
      {type === "input" ? (
        <input
          value={value}
          name={name}
          type={as ?? "text"}
          className={clsx(
            "text-white font-medium max-w-45 p-1 border-1 border-white/7 rounded-md",
            as === "birthday" && "noCalendarIcon"
          )}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <textarea
          value={value}
          name={name}
          className="text-white font-medium w-full border border-white/20 rounded-lg p-1 focus:outline-0 resize-none"
          rows={3}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
      )}
      <AnimatePresence>
        {suggestedValue && (
          <motion.button
            initial={{
              y: 10,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 10,
              opacity: 0,
            }}
            transition={{ duration: 0.45, ease: "backOut" }}
            className="w-full absolute -bottom-3/5 py-1 left-0 text-white 
            h-fit bg-neutral-700 cursor-pointer rounded-md"
            onClick={() => {
              onChange(suggestedValue);
              clearSugestedValue?.();
            }}
          >
            {suggestedValue}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
