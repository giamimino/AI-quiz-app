import { Children } from "@/app/types/global";
import clsx from "clsx";
import React from "react";

export const EditWrapper = React.memo(({ children }: Children) => {
  return (
    <div
      className="flex flex-col w-full p-2.5 border 
    border-white/20 rounded-md bg-neutral-800/20"
    >
      {children}
    </div>
  );
});
export const FormWrapper = ({
  value,
  label,
  onChange,
  type,
}: {
  label: string;
  value: string;
  type: "input" | "textarea";
  onChange: (value: string) => void;
}) => {
  return (
    <div className={clsx(
      "flex gap-1",
      type === "textarea" && "flex-col justify-center",
      type !== "textarea" && "items-center"
    )}>
      <label className="text-white">{label}:</label>
      {
        type === "input" ? (
          <input
            value={value}
            className="text-white font-medium max-w-30 p-1"
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <textarea
            value={value}
            className="text-white font-medium w-full border border-white/20 rounded-lg p-1 focus:outline-0 resize-none"
            rows={3}
            onChange={(e) => onChange(e.target.value)}
          >
          </textarea>
        )
        }
    </div>
  );
};
