import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default function DefaultInput({
  value,
  onChange,
  center,
  textarea,
  color,
  ...rest
}: {
  value: string;
  textarea?: boolean;
  color?: string;
  center?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return textarea ? (
    <textarea
      className={`h-8 rounded-xs outline-none px-2 py-0.75 transition-all duration-200 ${
        color ? `text-${color}` : "text-white"
      }
        ${value.trim() ? "border-transparent" : "border border-amber-50"} ${
        center && "text-center"
      }`}
      value={value}
      onChange={onChange}
    ></textarea>
  ) : (
    <input
      className={`h-8 rounded-xs outline-none px-2 transition-all duration-200 ${
        color ? `text-${color}` : "text-white"
      }
        ${value.trim() ? "border-transparent" : "border border-amber-50"} ${
        center && "text-center"
      }`}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
