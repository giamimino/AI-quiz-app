import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

export default function DefaultInput({
  value,
  onChange,
  ...rest
}: { value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void } & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input className={`h-8 rounded-xs outline-none px-2 transition-all duration-200 text-white
        ${value.trim() ? "border-transparent" : "border border-amber-50"}`} value={value} onChange={onChange} {...rest} />
  );
}
