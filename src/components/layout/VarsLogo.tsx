import { cn } from "@/lib/utils";
import logoHeader from "@/assets/vars-logo-header.png";
import logoSq from "@/assets/vars-logo-sq.png";
import logoWhite from "@/assets/vars-logo-white.png";
import logoNav from "@/assets/vars-logo-nav.png";

interface VarsLogoProps {
  className?: string;
  variant?: "header" | "white" | "sq" | "nav";
}

/**
 * Renders the original VARS Aquaculture logo images copied from the source assets.
 */
export function VarsLogo({ className, variant = "header" }: VarsLogoProps) {
  const src =
    variant === "white"
      ? logoWhite
      : variant === "sq"
        ? logoSq
        : variant === "nav"
          ? logoNav
          : logoHeader;
  const dimensions =
    variant === "white"
      ? { width: 2000, height: 676 }
      : variant === "sq"
        ? { width: 341, height: 341 }
        : { width: 991, height: 341 };

  return (
    <div className={cn("flex items-center select-none", className)}>
      <img
        src={src}
        alt="VARS Aquaculture"
        width={dimensions.width}
        height={dimensions.height}
        className={cn(
          "w-auto object-contain transition-transform duration-300 hover:scale-[1.02]",
          variant === "sq" ? "h-10 w-10" : "h-10 lg:h-12",
        )}
      />
    </div>
  );
}
