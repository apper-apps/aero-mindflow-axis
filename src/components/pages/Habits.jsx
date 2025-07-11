import { useState } from "react";
import { motion } from "framer-motion";
import { useHabits } from "@/hooks/useHabits";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import HabitCard from "@/components/molecules/HabitCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Habits = () => {
  const { habits, loading, error, toggleHabit, createHabit, updateHabit, deleteHabit, refetch } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Wellness",
    frequency: "daily"
  });

  const categories = ["Wellness", "Health", "Learning", "Productivity", "Creativity"];
  const frequencies = ["daily", "weekly", "monthly"];

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  const today = format(new Date(), "yyyy-MM-dd");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        await updateHabit(editingHabit.Id, formData);
      } else {
        await createHabit(formData);
      }
      setShowForm(false);
      setEditingHabit(null);
      setFormData({
        name: "",
        description: "",
        category: "Wellness",
        frequency: "daily"
      });
    } catch (err) {
      console.error("Failed to save habit:", err);
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      frequency: habit.frequency
    });
    setShowForm(true);
  };

  const handleDelete = async (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      await deleteHabit(habitId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Habits</h1>
          <p className="text-gray-400 mt-1">
            Build consistency and track your daily progress
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Habit
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {editingHabit ? "Edit Habit" : "Create New Habit"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Habit Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Meditation"
                required
              />
              
              <FormField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your habit"
                multiline
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    {frequencies.map(frequency => (
                      <option key={frequency} value={frequency}>
                        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="primary">
                  {editingHabit ? "Update Habit" : "Create Habit"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditingHabit(null);
                    setFormData({
                      name: "",
                      description: "",
                      category: "Wellness",
                      frequency: "daily"
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <Empty
          title="No habits yet"
          description="Start building better habits by creating your first one. Consistency is key to achieving your goals."
          action="Add Your First Habit"
          onAction={() => setShowForm(true)}
          icon="Target"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="primary">All ({habits.length})</Badge>
            {categories.map(category => {
              const count = habits.filter(h => h.category === category).length;
              return count > 0 ? (
                <Badge key={category} variant="default">
                  {category} ({count})
                </Badge>
              ) : null;
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.Id}
                habit={habit}
                isCompleted={habit.completions && habit.completions.includes(today)}
                onToggle={toggleHabit}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Habits;