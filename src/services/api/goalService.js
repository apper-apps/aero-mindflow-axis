import goalsData from "@/services/mockData/goals.json";

let goals = [...goalsData];

export const goalService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...goals];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return goals.find(goal => goal.Id === id);
  },

  async create(goalData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newGoal = {
      ...goalData,
      Id: Math.max(...goals.map(g => g.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    goals.push(newGoal);
    return newGoal;
  },

  async update(id, goalData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = goals.findIndex(goal => goal.Id === id);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...goalData };
      return goals[index];
    }
    throw new Error("Goal not found");
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = goals.findIndex(goal => goal.Id === id);
    if (index !== -1) {
      goals.splice(index, 1);
      return true;
    }
    throw new Error("Goal not found");
  }
};