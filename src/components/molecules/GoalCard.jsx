import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card
      className="overflow-hidden hover:scale-[1.02] transition-all duration-300 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative">
        {goal.imageUrl && (
          <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <img
              src={goal.imageUrl}
              alt={goal.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {showActions && (
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(goal)}
              className="bg-black/50 hover:bg-black/70"
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(goal.Id)}
              className="bg-black/50 hover:bg-black/70"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-100 mb-2">{goal.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {goal.description}
        </p>
        
        {goal.affirmation && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-300 italic text-center">
              "{goal.affirmation}"
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Target" size={16} />
            <span>Goal</span>
          </div>
          {goal.targetDate && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={16} />
              <span>{format(new Date(goal.targetDate), "MMM yyyy")}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;