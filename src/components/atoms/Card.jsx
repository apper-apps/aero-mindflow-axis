import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface rounded-xl border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;