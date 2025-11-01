import { Children } from "@/app/types/global";
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
  label,
  value,
  isEditing,
  requestEditing,
  sendResult,
  ref,
  type
}: {
  label: string;
  value: string;
  type: "input" | "textarea";
  isEditing?: boolean;
  requestEditing?: () => void;
  sendResult?: (value: string) => void,
  ref?: React.RefObject<HTMLInputElement & HTMLTextAreaElement>
}) => {
  return (
    <div className="flex gap-1">
      <label className="text-white">{label}:</label>
      {isEditing ? (
        type === "input" ? (
          <input ref={ref} defaultValue={value} className="text-white font-medium" />
        ) : (
          <textarea ref={ref} className="text-white font-medium">{value}</textarea>
        )
      ) : (
        <button className="text-white font-medium cursor-pointer" onClick={requestEditing}>{value}</button>
      )}
    </div>
  );
};
