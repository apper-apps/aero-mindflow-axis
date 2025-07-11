import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title, 
  description, 
  action, 
  onAction, 
  icon = "Inbox" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[300px] text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      {action && onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {action}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;