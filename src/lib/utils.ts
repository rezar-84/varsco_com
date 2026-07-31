import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ThumbnailAspect = "4:3" | "1:1" | "2:3";
export type ThumbnailSize = "sm" | "lg";

/**
 * Resolves formatted thumbnail asset path based on target aspect ratio and size variant.
 */
export function getThumbnail(
  imagePath?: string | null,
  aspect: ThumbnailAspect = "4:3",
  size: ThumbnailSize = "lg",
): string | undefined {
  if (!imagePath) return undefined;

  const filename = imagePath.split("/").pop();
  if (!filename) return imagePath;

  const baseName = filename.substring(0, filename.lastIndexOf(".")) || filename;
  const suffixMap: Record<ThumbnailAspect, Record<ThumbnailSize, string>> = {
    "4:3": { lg: "4x3_lg", sm: "4x3_sm" },
    "1:1": { lg: "1x1_lg", sm: "1x1_sm" },
    "2:3": { lg: "2x3_lg", sm: "2x3_sm" },
  };

  const suffix = suffixMap[aspect]?.[size] || "4x3_lg";
  return `/src/assets/products/thumbnails/${baseName}_${suffix}.webp`;
}
