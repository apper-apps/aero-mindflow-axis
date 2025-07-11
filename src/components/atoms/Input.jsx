import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input

Input.displayName = "Input";
