import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/20",
    secondary: "bg-surface text-gray-100 hover:bg-surface/90 border border-gray-700 hover:border-gray-600",
    accent: "bg-gradient-to-r from-accent to-warning text-white hover:from-accent/90 hover:to-warning/90 shadow-lg shadow-accent/20",
    ghost: "text-gray-300 hover:text-white hover:bg-surface/50",
    success: "bg-success text-white hover:bg-success/90 shadow-lg shadow-success/20",
    danger: "bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;