import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function StarRating({
  value,
  size = "sm",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizeClass = SIZE_CLASSES[size];
  const rounded = Math.round(value);

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= rounded;
        const icon = (
          <Star
            className={cn(
              sizeClass,
              filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
            )}
          />
        );
        if (!interactive) {
          return <span key={star}>{icon}</span>;
        }
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === rounded}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange?.(star)}
            className="transition-transform hover:scale-110"
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
