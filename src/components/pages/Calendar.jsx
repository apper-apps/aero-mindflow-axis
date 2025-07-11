import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHabits } from "@/hooks/useHabits";
import { useJournal } from "@/hooks/useJournal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

const Calendar = () => {
  const { habits, loading: habitsLoading, error: habitsError } = useHabits();
  const { entries, loading: journalLoading, error: journalError } = useJournal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (habitsLoading || journalLoading) {
    return <Loading />;
  }

  if (habitsError || journalError) {
    return <Error message="Failed to load calendar data" />;
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getHabitsForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return habits.filter(habit => 
      habit.completions && habit.completions.includes(dateStr)
    );
  };

  const getJournalForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.filter(entry => 
      entry.date.startsWith(dateStr)
    );
  };

  const getDateStats = (date) => {
    const completedHabits = getHabitsForDate(date);
    const journalEntries = getJournalForDate(date);
    const totalHabits = habits.filter(h => h.frequency === "daily").length;
    
    return {
      completedHabits: completedHabits.length,
      totalHabits,
      completionRate: totalHabits > 0 ? (completedHabits.length / totalHabits) * 100 : 0,
      hasJournal: journalEntries.length > 0,
      journalCount: journalEntries.length
    };
  };

  const selectedDateStats = getDateStats(selectedDate);
  const selectedDateHabits = getHabitsForDate(selectedDate);
  const selectedDateJournal = getJournalForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Calendar</h1>
          <p className="text-gray-400 mt-1">
            Track your progress and patterns over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <span className="text-lg font-semibold text-gray-100 min-w-[200px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day, index) => {
                const stats = getDateStats(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative p-2 rounded-lg border transition-all duration-200 hover:scale-105
                      ${isSelected 
                        ? "bg-primary border-primary text-white" 
                        : isToday
                          ? "bg-accent/20 border-accent text-accent"
                          : "bg-surface border-gray-700 text-gray-300 hover:border-gray-600"
                      }
                    `}
                  >
                    <div className="text-sm font-medium">
                      {format(day, "d")}
                    </div>
                    
                    {/* Progress indicators */}
                    <div className="flex items-center justify-center mt-1 space-x-1">
                      {stats.completionRate > 0 && (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            stats.completionRate === 100 ? "bg-success" :
                            stats.completionRate >= 75 ? "bg-accent" :
                            stats.completionRate >= 50 ? "bg-warning" : "bg-error"
                          }`}
                        />
                      )}
                      {stats.hasJournal && (
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span>All habits completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span>Journal entry</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Day Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Date Header */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              {format(selectedDate, "EEEE, MMMM d")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {selectedDateStats.completedHabits}
                </p>
                <p className="text-sm text-gray-400">Habits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {selectedDateStats.journalCount}
                </p>
                <p className="text-sm text-gray-400">Journal</p>
              </div>
            </div>
          </Card>

          {/* Habits for Selected Date */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-100">Habits</h4>
              <Badge variant="success">
                {selectedDateStats.completedHabits}/{selectedDateStats.totalHabits}
              </Badge>
            </div>
            
            {selectedDateHabits.length > 0 ? (
              <div className="space-y-2">
                {selectedDateHabits.map(habit => (
                  <div key={habit.Id} className="flex items-center space-x-2">
                    <ApperIcon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm text-gray-300">{habit.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No habits completed</p>
            )}
          </Card>

          {/* Journal for Selected Date */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-100">Journal</h4>
              <Badge variant="secondary">
                {selectedDateStats.journalCount}
              </Badge>
            </div>
            
            {selectedDateJournal.length > 0 ? (
              <div className="space-y-3">
                {selectedDateJournal.map(entry => (
                  <div key={entry.Id} className="border-l-2 border-secondary pl-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={entry.type === "morning" ? "accent" : "secondary"}>
                        {entry.type}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <ApperIcon 
                          name={entry.mood > 3 ? "Smile" : entry.mood === 3 ? "Meh" : "Frown"} 
                          size={14} 
                          className="text-gray-400"
                        />
                        <span className="text-xs text-gray-400">{entry.mood}/5</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No journal entries</p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;