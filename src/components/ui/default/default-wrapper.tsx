import { Children } from "@/types/global";
import clsx from "clsx";
export default function DefaultWrapper({
  children,
  noBorder,
  noRounded,
  wFit,
  p,
  flex,
  flexBasis,
  dFlex,
  flexWrap,
  rel,
  noOverflow,
  gap,
  col,
  solid
}: Children & {
  noBorder?: { t?: boolean; r?: boolean; b?: boolean; l?: boolean } | boolean;
  noRounded?:
    | { tl?: boolean; tr?: boolean; br?: boolean; bl?: boolean }
    | boolean;
    wFit?: boolean,
  p?: { px?: number; py?: number; p?: number };
  flex?: number,
  flexBasis?: string,
  dFlex?: boolean,
  flexWrap?: boolean,
  rel?: boolean,
  noOverflow?: boolean,
  gap?: number,
  col?: boolean,
  solid?: boolean
}) {
  const borders = {
    "border-t-0": typeof noBorder === "object" && noBorder?.t,
    "border-r-0": typeof noBorder === "object" && noBorder?.r,
    "border-b-0": typeof noBorder === "object" && noBorder?.b,
    "border-l-0": typeof noBorder === "object" && noBorder?.l,
    "border-none": noBorder === true
  };

  const rounds = {
    "rounded-tl-0": typeof noRounded === "object" && noRounded?.tl,
    "rounded-tr-0": typeof noRounded === "object" && noRounded?.tr,
    "rounded-bl-0": typeof noRounded === "object" && noRounded?.bl,
    "rounded-br-0": typeof noRounded === "object" && noRounded?.br,
    "rounded-none": noRounded === true,
  };
  return (
    <div
      className={clsx(
        `border-2 border-dark-15 rounded-xl`,
        borders,
        rounds,
        wFit ? "w-fit" : "w-full",
        dFlex && "flex",
        flexWrap && "flex-wrap",
        rel && "relative",
        noOverflow && "overflow-hidden",
        col && !dFlex && "flex flex-col",
        col && "flex-col",
        solid ? "border-solid" : "border-dashed"
      )}
      style={{
        padding: p
          ? `${
              p?.p
                ? `${p.p * 4}px`
                : `${p?.py ? `${p.py * 4}px` : "0"} ${p?.px ? `${p.px * 4}px` : "0"}`
            }`
          : "",
          flex: flex,
          flexBasis: flexBasis,
          gap: gap ? `${gap * 4}px` : ""
      }}
    >
      {children}
    </div>
  );
}
