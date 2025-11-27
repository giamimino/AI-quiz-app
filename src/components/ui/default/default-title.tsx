import { useEffect, useRef } from "react";

export default function DefaultTitle({
  title,
  text,
  CustomClass,
  font,
}: {
  title: string;
  text?: number;
  font?: string;
  CustomClass?: string | null;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const base = text || 16;

  const min = Math.round(base * 0.6)
  const max = base
  const fluid = (base / 16) * 1.2

  const style = {
    fontWeight: font || "normal",
    fontSize: `clamp(${min}px, ${fluid}vw, ${max}px)`,
  };

  useEffect(() => {
    if(CustomClass && titleRef.current) {
      titleRef.current.classList.add(...CustomClass.split(" "))
    }
  }, [])

  return (
    <h1 className="text-white" ref={titleRef} style={style}>
      {title}
    </h1>
  );
}