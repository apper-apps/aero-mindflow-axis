import { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const JournalCard = ({ entry, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const getMoodIcon = (mood) => {
    const icons = {
      1: "Frown",
      2: "Meh",
      3: "Smile",
      4: "Grin",
      5: "Heart"
    };
    return icons[mood] || "Meh";
  };

  const getMoodColor = (mood) => {
    const colors = {
      1: "text-red-400",
      2: "text-orange-400",
      3: "text-yellow-400",
      4: "text-green-400",
      5: "text-pink-400"
    };
    return colors[mood] || "text-gray-400";
  };

  return (
    <Card
      className="p-4 hover:scale-[1.01] transition-all duration-300"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Badge variant={entry.type === "morning" ? "accent" : "primary"}>
              {entry.type === "morning" ? "Morning" : "Evening"}
            </Badge>
            <span className="text-sm text-gray-400">
              {format(new Date(entry.date), "PPP")}
            </span>
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={getMoodIcon(entry.mood)} 
                size={16} 
                className={getMoodColor(entry.mood)}
              />
              <span className="text-sm text-gray-400">{entry.mood}/5</span>
            </div>
          </div>
<p className="text-gray-300 text-sm line-clamp-3 mb-2">
            {entry.content}
          </p>
          {entry.imageUrl && (
            <div className="mb-3">
              <img
                src={entry.imageUrl}
                alt="Journal entry"
                className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-600"
              />
            </div>
          )}
{((entry.Tags && entry.Tags.length > 0) || (entry.tags && entry.tags.length > 0)) && (
            <div className="flex flex-wrap gap-1">
              {(entry.Tags ? (typeof entry.Tags === 'string' ? entry.Tags.split(',') : entry.Tags) : entry.tags).map((tag, index) => (
                <Badge key={index} variant="default">
                  #{tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(entry)}
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(entry.Id)}
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default JournalCard;