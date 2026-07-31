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

  return (
    <div className={cn("flex items-center select-none", className)}>
      <img
        src={src}
        alt="VARS Aquaculture"
        className={cn(
          "w-auto object-contain transition-transform duration-300 hover:scale-[1.02]",
          variant === "sq" ? "h-10 w-10" : "h-10 lg:h-12",
        )}
      />
    </div>
  );
}
