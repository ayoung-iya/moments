import { cloudflareImageVariantURL } from "@/lib/cloudflareImageUtils";
import NextImage from "next/image";

interface ImageProps {
  url: string;
  width: number;
  height: number;
}

export default function Image({ url, width, height }: ImageProps) {
  return (
    <div className="relative -mx-3 w-[100% + 0.75rem * 2]" style={{ aspectRatio: width / height }}>
      <NextImage className="object-contain object-center" src={cloudflareImageVariantURL(url)} alt="이미지" fill />
    </div>
  );
}
