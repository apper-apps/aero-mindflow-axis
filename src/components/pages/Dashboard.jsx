import { motion } from "framer-motion";
import { useHabits } from "@/hooks/useHabits";
import { useJournal } from "@/hooks/useJournal";
import { useGoals } from "@/hooks/useGoals";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import HabitCard from "@/components/molecules/HabitCard";
import JournalCard from "@/components/molecules/JournalCard";
import GoalCard from "@/components/molecules/GoalCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Dashboard = () => {
  const { habits, loading: habitsLoading, error: habitsError, toggleHabit } = useHabits();
  const { entries, loading: journalLoading, error: journalError } = useJournal();
  const { goals, loading: goalsLoading, error: goalsError } = useGoals();

  if (habitsLoading || journalLoading || goalsLoading) {
    return <Loading type="stats" />;
  }

  if (habitsError || journalError || goalsError) {
    return <Error message="Failed to load dashboard data" />;
  }

  const today = format(new Date(), "yyyy-MM-dd");
  const todayHabits = habits.filter(habit => habit.frequency === "daily");
  const completedToday = todayHabits.filter(habit => 
    habit.completions && habit.completions.includes(today)
  ).length;
  const completionRate = todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0;

  const recentEntries = entries.slice(0, 3);
  const activeGoals = goals.slice(0, 3);

  const totalStreaks = habits.reduce((sum, habit) => {
    if (!habit.completions || habit.completions.length === 0) return sum;
    
    let streak = 0;
    let currentDate = new Date();
    
    while (streak < habit.completions.length) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      if (habit.completions.includes(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return sum + streak;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div className="hidden md:block">
            <ProgressRing progress={completionRate} size={100} />
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Progress"
            value={`${completedToday}/${todayHabits.length}`}
            icon="CheckCircle"
            color="success"
            trend={completionRate > 75 ? 15 : completionRate > 50 ? 5 : -10}
          />
          <StatCard
            title="Active Habits"
            value={habits.length}
            icon="Target"
            color="primary"
          />
          <StatCard
            title="Total Streaks"
            value={totalStreaks}
            icon="Flame"
            color="accent"
          />
          <StatCard
            title="Journal Entries"
            value={entries.length}
            icon="BookOpen"
            color="secondary"
          />
        </div>
      </motion.div>

      {/* Today's Habits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-100">Today's Habits</h2>
          <Button variant="primary" size="sm">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Habit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayHabits.slice(0, 6).map((habit) => (
            <HabitCard
              key={habit.Id}
              habit={habit}
              isCompleted={habit.completions && habit.completions.includes(today)}
              onToggle={toggleHabit}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Journal Entries */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Recent Journal</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <JournalCard
                key={entry.Id}
                entry={entry}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </motion.div>

        {/* Active Goals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Active Goals</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.Id}
                goal={goal}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;