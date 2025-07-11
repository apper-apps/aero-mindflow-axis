import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PremiumBadge = ({ className, size = "sm" }) => {
  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-premium-start to-premium-end text-white font-medium",
      sizeClasses[size],
      className
    )}>
      <ApperIcon name="Crown" size={iconSizes[size]} />
      <span>Premium</span>
    </div>
  );
};

export default PremiumBadge;