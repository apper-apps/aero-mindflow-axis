import { useState } from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GoalCard from "@/components/molecules/GoalCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const Goals = () => {
  const { goals, loading, error, createGoal, updateGoal, deleteGoal, refetch } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    affirmation: "",
    targetDate: ""
  });

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goalData = {
        ...formData,
        targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null
      };
      
      if (editingGoal) {
        await updateGoal(editingGoal.Id, goalData);
      } else {
        await createGoal(goalData);
      }
      
      setShowForm(false);
      setEditingGoal(null);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        affirmation: "",
        targetDate: ""
      });
    } catch (err) {
      console.error("Failed to save goal:", err);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      imageUrl: goal.imageUrl || "",
      affirmation: goal.affirmation || "",
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : ""
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal(goalId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Goals</h1>
          <p className="text-gray-400 mt-1">
            Visualize your dreams and manifest your future
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Inspiration Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
      >
        <blockquote className="text-center">
          <p className="text-lg text-gray-100 italic mb-2">
            "A goal is a dream with a deadline."
          </p>
          <cite className="text-sm text-gray-400">— Napoleon Hill</cite>
        </blockquote>
      </motion.div>

      {/* Create/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Goal Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Complete Marathon"
                required
              />
              
              <FormField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your goal in detail..."
                multiline
                rows={4}
              />
              
              <FormField
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              
              <FormField
                label="Affirmation"
                value={formData.affirmation}
                onChange={(e) => setFormData({ ...formData, affirmation: e.target.value })}
                placeholder="I am capable of achieving this goal..."
                multiline
                rows={3}
              />
              
              <FormField
                label="Target Date"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
              
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="primary">
                  {editingGoal ? "Update Goal" : "Create Goal"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                    setFormData({
                      title: "",
                      description: "",
                      imageUrl: "",
                      affirmation: "",
                      targetDate: ""
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

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Empty
          title="No goals yet"
          description="Create your first goal and start manifesting your dreams. Visualize your success and make it happen."
          action="Create Your First Goal"
          onAction={() => setShowForm(true)}
          icon="Target"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {goals.map((goal) => (
            <GoalCard
              key={goal.Id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Goals;