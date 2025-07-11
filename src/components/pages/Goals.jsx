import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { goals, loading, error, createGoal, updateGoal, deleteGoal, refetch } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    affirmation: "",
    targetDate: "",
    category: ""
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
        targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null,
        category: formData.category || 'mid-term'
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
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : "",
      category: goal.category || ""
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
          <h1 className="text-3xl font-bold text-gray-100">{t('goals.title')}</h1>
          <p className="text-gray-400 mt-1">
            {t('goals.subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {t('goals.add_goal')}
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
            "{t('goals.quote')}"
          </p>
          <cite className="text-sm text-gray-400">{t('goals.quote_author')}</cite>
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
              {editingGoal ? t('goals.edit_goal') : t('goals.create_new')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
<FormField
                label={t('goals.goal_title')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('goals.goal_title_placeholder')}
                required
              />
              
<FormField
                label={t('goals.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('goals.description_placeholder')}
                multiline
                rows={4}
              />
<FormField
                label={t('goals.image_url')}
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder={t('goals.image_url_placeholder')}
              />
<FormField
                label={t('goals.affirmation')}
                value={formData.affirmation}
                onChange={(e) => setFormData({ ...formData, affirmation: e.target.value })}
                placeholder={t('goals.affirmation_placeholder')}
                multiline
                rows={3}
              />
<FormField
                label={t('goals.target_date')}
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
              
              <FormField
                label={t('goals.category')}
                type="select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: "", label: t('goals.auto_categorize') },
                  { value: "short-term", label: t('goals.short_term') },
                  { value: "mid-term", label: t('goals.mid_term') },
                  { value: "long-term", label: t('goals.long_term') }
                ]}
              />
<div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="primary">
                  {editingGoal ? t('goals.update_goal') : t('goals.create_goal')}
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
                      targetDate: "",
                      category: ""
                    });
                  }}
>
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
<Empty
          title={t('goals.no_goals')}
          description={t('goals.no_goals_desc')}
          action={t('goals.create_first')}
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