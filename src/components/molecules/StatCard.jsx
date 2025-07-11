import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <Card className="p-6 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-100">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1 mt-1">
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={trend > 0 ? "text-success" : "text-error"}
              />
              <span className={cn(
                "text-sm font-medium",
                trend > 0 ? "text-success" : "text-error"
              )}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg bg-gradient-to-br", colorClasses[color])}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;