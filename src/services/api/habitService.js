import habitsData from "@/services/mockData/habits.json";

let habits = [...habitsData];

export const habitService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...habits];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return habits.find(habit => habit.Id === id);
  },

  async create(habitData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newHabit = {
      ...habitData,
      Id: Math.max(...habits.map(h => h.Id)) + 1,
      completions: [],
      createdAt: new Date().toISOString()
    };
    habits.push(newHabit);
    return newHabit;
  },

  async update(id, habitData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = habits.findIndex(habit => habit.Id === id);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...habitData };
      return habits[index];
    }
    throw new Error("Habit not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = habits.findIndex(habit => habit.Id === id);
    if (index !== -1) {
      habits.splice(index, 1);
      return true;
    }
    throw new Error("Habit not found");
  },

  async toggleCompletion(id, date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const habit = habits.find(h => h.Id === id);
    if (!habit) throw new Error("Habit not found");
    
    const dateStr = date.toISOString().split('T')[0];
    if (habit.completions.includes(dateStr)) {
      habit.completions = habit.completions.filter(d => d !== dateStr);
    } else {
      habit.completions.push(dateStr);
    }
    
    return habit;
  }
};