import clsx from "clsx";
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Icon } from "@iconify/react";

export default function PrimaryButton({
  label,
  active,
  colors,
  icon,
  p,
  noBoder,
  wFit,
  textCenter,
  ...rest
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string;
  icon?: string;
  active?: boolean;
  noBoder?: boolean;
  p?: { px?: number; py?: number; p?: number };
  colors?: {
    hover?: { bg?: string; text?: string };
    text?: string;
    bg?: string;
  };
  wFit?: boolean,
  textCenter?: boolean,
}) {
  return (
    <button
      className={clsx(
        `border border-dark-15 border-dashed hover:opacity-80 flex gap-2.5 items-center rounded-md cursor-pointer`,
        active && "bg-dark-10 border-none text-white p-px",
        !colors?.text && "text-grey-70",
        noBoder && "border-0",
        !p && "py-2.25 px-3.75",
        wFit && "w-fit",
        textCenter && "text-center justify-center",
      )}
      {...rest}
      style={{
        backgroundColor: colors?.bg
          ? `var(--color-${colors.bg})`
          : "",
        color: colors?.text ? `var(--color-${colors.text})` : "",
        padding: p
          ? `${
              p?.p
                ? `${p.p * 4}px`
                : `${p?.py ? `${p.py * 4}px` : "0"} ${p?.px ? `${p.px * 4}px` : "0"}`
            }`
          : "",
      }}
    >
      {label && <span>{label}</span>}
      {icon && <Icon icon={icon} />}
    </button>
  );
}
