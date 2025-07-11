import { useState, useEffect } from "react";
import { goalService } from "@/services/api/goalService";
import { toast } from "react-toastify";

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData) => {
    try {
      const newGoal = await goalService.create(goalData);
      setGoals(prevGoals => [...prevGoals, newGoal]);
      toast.success("Goal created successfully");
      return newGoal;
    } catch (err) {
      toast.error("Failed to create goal");
      throw err;
    }
  };

  const updateGoal = async (goalId, goalData) => {
    try {
      const updatedGoal = await goalService.update(goalId, goalData);
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.Id === goalId ? updatedGoal : goal
        )
      );
      toast.success("Goal updated successfully");
      return updatedGoal;
    } catch (err) {
      toast.error("Failed to update goal");
      throw err;
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await goalService.delete(goalId);
      setGoals(prevGoals => prevGoals.filter(goal => goal.Id !== goalId));
      toast.success("Goal deleted successfully");
    } catch (err) {
      toast.error("Failed to delete goal");
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: loadGoals
  };
};