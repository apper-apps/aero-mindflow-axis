import { useState } from "react";
import Card from "@/components/atoms/Card";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const HabitCard = ({ habit, onToggle, onEdit, onDelete, isCompleted }) => {
  const [showActions, setShowActions] = useState(false);
  const today = format(new Date(), "yyyy-MM-dd");
  
  const getTodayCompletions = () => {
    if (!habit.completions || !habit.completions[today]) return 0;
    return habit.completions[today];
  };

  const todayCompletions = getTodayCompletions();
  const getStreakCount = () => {
    if (!habit.completions || habit.completions.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (streak < habit.completions.length) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      if (habit.completions.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streakCount = getStreakCount();

return (
    <Card
      className={cn(
        "p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer",
        todayCompletions > 0 && "ring-2 ring-success/30 bg-gradient-to-br from-success/5 to-transparent"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div 
          className="flex items-start space-x-3 flex-1"
          onClick={() => onToggle(habit.Id)}
        >
          <div className="flex items-center space-x-2">
            <Checkbox checked={todayCompletions > 0} readOnly />
            {todayCompletions > 0 && (
              <div className="flex items-center justify-center w-6 h-6 bg-success text-white text-xs font-bold rounded-full">
                {todayCompletions}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
<h3 className={cn(
              "font-medium text-gray-100 mb-1",
              todayCompletions > 0 && "text-success"
            )}>
              {habit.name}
              {todayCompletions > 1 && (
                <span className="ml-2 text-xs bg-success/20 text-success px-2 py-1 rounded">
                  {todayCompletions}x today
                </span>
              )}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-400 mb-2">{habit.description}</p>
            )}
<div className="flex items-center space-x-2">
              <Badge variant={
                habit.category === "Health" ? "success" : 
                habit.category === "Productivity" ? "primary" : 
                habit.category === "Mood Tracker" ? "secondary" : "accent"
              }>
                {habit.category}
              </Badge>
              {streakCount > 0 && (
                <div className="flex items-center space-x-1 text-accent">
                  <ApperIcon name="Flame" size={16} className="flame-animation" />
                  <span className="text-sm font-medium">{streakCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(habit);
              }}
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(habit.Id);
              }}
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HabitCard;