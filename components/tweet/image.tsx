"use client";

import { cloudflareImageVariantURL } from "@/lib/cloudflareImageUtils";
import { PhotoIcon } from "@heroicons/react/24/solid";
import NextImage from "next/image";
import { useState } from "react";

interface ImageProps {
  url: string;
  width: number;
  height: number;
}

export default function Image({ url, width, height }: ImageProps) {
  const [isError, setIsError] = useState(false);

  return (
    <div className="w-[100% + 0.75rem * 2] relative -mx-3" style={{ aspectRatio: width / height }}>
      {!isError && (
        <NextImage
          className="object-contain object-center"
          src={cloudflareImageVariantURL(url)}
          alt="이미지"
          fill
          onError={() => {
            setIsError(true);
          }}
        />
      )}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center *:text-stone-700">
          <PhotoIcon className="size-1/6" />
          <p>이미지를 불러올 수 없습니다</p>
        </div>
      )}
    </div>
  );
}
