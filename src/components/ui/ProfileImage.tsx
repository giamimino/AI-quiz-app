import { ProfileImageProps } from "@/app/types/props";
import React from "react";
import Image from "next/image";
import clsx from "clsx";

export default function ProfileImage({ src, w, h, alt, r }: ProfileImageProps) {
  return (
    <Image
      src={src}
      width={w ?? 64}
      height={h ?? 64}
      alt={alt ?? src}
      className={clsx(
        !r && "rounded-full"
      )}
      style={{
        borderRadius: r
      }}
    />
  );
}
