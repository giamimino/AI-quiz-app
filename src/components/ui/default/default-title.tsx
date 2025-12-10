import clsx from "clsx";
import { useRef } from "react";

export default function DefaultTitle({
  title,
  text,
  CustomClass,
  font,
  onClick,
  pointer,
}: {
  title: string;
  text?: number;
  font?: string;
  CustomClass?: string | null;
  onClick?: () => void;
  pointer?: boolean;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const base = text || 16;

  const min = Math.round(base * 0.7);
  const max = base;
  const fluid = (base / 16) * 1.2;

  const style = {
    fontWeight: font || "normal",
    fontSize: `clamp(${min}px, ${fluid}vw, ${max}px)`,
  };

  if (CustomClass && titleRef.current) {
    titleRef.current.classList.add(...CustomClass.split(" "));
  }

  return (
    <h1
      className={clsx("text-white", pointer && "cursor-pointer")}
      ref={titleRef}
      style={style}
      {...(onClick ? { onClick: onClick } : {})}
    >
      {title}
    </h1>
  );
}
