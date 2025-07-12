import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { habitFulfillmentService } from "@/services/api/habitFulfillmentService";
import { useHabits } from "@/hooks/useHabits";
import { useJournal } from "@/hooks/useJournal";
import { useGoals } from "@/hooks/useGoals";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import JournalCard from "@/components/molecules/JournalCard";
import HabitCard from "@/components/molecules/HabitCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import GoalCard from "@/components/molecules/GoalCard";
import StatCard from "@/components/molecules/StatCard";
import quotesService from "@/services/api/quotesService";
const Dashboard = () => {
  const { t } = useTranslation();
const { habits, loading: habitsLoading, error: habitsError, toggleHabit } = useHabits();
  const { entries, loading: journalLoading, error: journalError } = useJournal();
  const [fulfillments, setFulfillments] = useState([]);
  const [fulfillmentsLoading, setFulfillmentsLoading] = useState(true);
  const [fulfillmentsError, setFulfillmentsError] = useState(null);
  const { goals, loading: goalsLoading, error: goalsError } = useGoals();
  
const [dailyQuote, setDailyQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(null);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const quote = await quotesService.getDailyQuote();
        setDailyQuote(quote);
      } catch (error) {
        setQuoteError(error.message);
      } finally {
        setQuoteLoading(false);
      }
    };

    const fetchTodaysFulfillments = async () => {
      try {
        setFulfillmentsLoading(true);
        setFulfillmentsError(null);
        const data = await habitFulfillmentService.getTodaysFulfillments();
        setFulfillments(data);
      } catch (error) {
        setFulfillmentsError(error.message);
      } finally {
        setFulfillmentsLoading(false);
      }
    };

    fetchDailyQuote();
    fetchTodaysFulfillments();
  }, []);

if (habitsLoading || journalLoading || goalsLoading || quoteLoading || fulfillmentsLoading) {
    return <Loading type="stats" />;
  }

  if (habitsError || journalError || goalsError || quoteError || fulfillmentsError) {
    return <Error message="Failed to load dashboard data" />;
  }

  const today = format(new Date(), "yyyy-MM-dd");
  const todayHabits = habits.filter(habit => habit.frequency === "daily");
// Count completed habits based on actual fulfillment records
  const completedHabitIds = new Set(fulfillments.map(f => f.habit?.Id).filter(Boolean));
  const completedToday = todayHabits.filter(habit => completedHabitIds.has(habit.Id)).length;
  const completionRate = todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0;

  const recentEntries = entries.slice(0, 3);
  const activeGoals = goals.slice(0, 3);

const totalStreaks = habits.reduce((sum, habit) => {
    if (!habit.completions || Object.keys(habit.completions).length === 0) return sum;
    
    let streak = 0;
    let currentDate = new Date();
    
    // Calculate streak by checking consecutive days backwards from today
    while (true) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      if (habit.completions[dateStr]) {
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
      {/* Daily Quote Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <ApperIcon name="Quote" size={24} className="text-primary" />
              <span className="text-sm font-medium text-primary capitalize">
                {dailyQuote?.category}
              </span>
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold text-gray-100 mb-3 leading-relaxed">
              "{dailyQuote?.text}"
            </blockquote>
            <p className="text-gray-400 text-lg">
              — {dailyQuote?.author}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div className="hidden md:block ml-6">
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
            title={t('dashboard.todays_progress')}
            value={`${completedToday}/${todayHabits.length}`}
            icon="CheckCircle"
            color="success"
            trend={completionRate > 75 ? 15 : completionRate > 50 ? 5 : -10}
          />
          <StatCard
            title={t('dashboard.active_habits')}
            value={habits.length}
            icon="Target"
            color="primary"
          />
          <StatCard
            title={t('dashboard.total_streaks')}
            value={totalStreaks}
            icon="Flame"
            color="accent"
          />
          <StatCard
            title={t('dashboard.journal_entries')}
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
          <h2 className="text-2xl font-bold text-gray-100">{t('dashboard.todays_habits')}</h2>
          <Button variant="primary" size="sm">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {t('dashboard.add_habit')}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todayHabits.slice(0, 6).map((habit) => (
            <HabitCard
              key={habit.Id}
habit={habit}
              isCompleted={habit.completions && habit.completions[today]}
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
            <h2 className="text-2xl font-bold text-gray-100">{t('dashboard.recent_journal')}</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              {t('dashboard.view_all')}
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
            <h2 className="text-2xl font-bold text-gray-100">{t('dashboard.active_goals')}</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              {t('dashboard.view_all')}
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