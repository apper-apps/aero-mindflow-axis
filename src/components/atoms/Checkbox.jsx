import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          "w-6 h-6 rounded-md border-2 transition-all duration-200 cursor-pointer flex items-center justify-center",
          checked
            ? "bg-gradient-to-r from-primary to-secondary border-primary shadow-lg shadow-primary/20"
            : "border-gray-600 bg-surface hover:border-gray-500",
          className
        )}
      >
        {checked && (
          <ApperIcon
            name="Check"
            size={16}
            className="text-white checkmark-animation"
          />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;