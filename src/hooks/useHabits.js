import { useState, useEffect } from "react";
import { habitService } from "@/services/api/habitService";
import { toast } from "react-toastify";

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await habitService.getAll();
      setHabits(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

const toggleHabit = async (habitId) => {
    try {
      const today = new Date();
      const updatedHabit = await habitService.toggleCompletion(habitId, today);
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.Id === habitId ? updatedHabit : habit
        )
);
      const dateStr = today.toISOString().split('T')[0];
      const todayCompletions = updatedHabit.completions?.[dateStr] || 0;
      toast.success(`Habit completed ${todayCompletions} time${todayCompletions !== 1 ? 's' : ''} today`);
    } catch (err) {
      toast.error("Failed to update habit");
      console.error('Toggle habit error:', err);
    }
  };

  const createHabit = async (habitData) => {
    try {
      const newHabit = await habitService.create(habitData);
      setHabits(prevHabits => [...prevHabits, newHabit]);
      toast.success("Habit created successfully");
      return newHabit;
    } catch (err) {
      toast.error("Failed to create habit");
      throw err;
    }
  };

  const updateHabit = async (habitId, habitData) => {
    try {
      const updatedHabit = await habitService.update(habitId, habitData);
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.Id === habitId ? updatedHabit : habit
        )
      );
      toast.success("Habit updated successfully");
      return updatedHabit;
    } catch (err) {
      toast.error("Failed to update habit");
      throw err;
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await habitService.delete(habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit.Id !== habitId));
      toast.success("Habit deleted successfully");
    } catch (err) {
      toast.error("Failed to delete habit");
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  return {
    habits,
    loading,
    error,
    toggleHabit,
    createHabit,
    updateHabit,
    deleteHabit,
    refetch: loadHabits
  };
};