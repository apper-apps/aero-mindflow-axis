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
    
    // Auto-calculate category if not provided
    let category = goalData.category;
    if (!category && goalData.targetDate) {
      const targetDate = new Date(goalData.targetDate);
      const now = new Date();
      const monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
      
      if (monthsDiff < 3) {
        category = 'short-term';
      } else if (monthsDiff <= 12) {
        category = 'mid-term';
      } else {
        category = 'long-term';
      }
    }
    
    const newGoal = {
      ...goalData,
      Id: Math.max(...goals.map(g => g.Id)) + 1,
      createdAt: new Date().toISOString(),
      linkedHabits: goalData.linkedHabits || [],
      category: category || 'mid-term'
    };
    goals.push(newGoal);
    return newGoal;
  },

async update(id, goalData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = goals.findIndex(goal => goal.Id === id);
    if (index !== -1) {
// Auto-calculate category if not provided but target date changed
      let category = goalData.category;
      if (!category && goalData.targetDate) {
        const targetDate = new Date(goalData.targetDate);
        const now = new Date();
        const monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
        
        if (monthsDiff < 3) {
          category = 'short-term';
        } else if (monthsDiff <= 12) {
          category = 'mid-term';
        } else {
          category = 'long-term';
        }
      }
      
      goals[index] = { 
        ...goals[index], 
        ...goalData,
        linkedHabits: goalData.linkedHabits || goals[index].linkedHabits || [],
        category: category || goals[index].category || 'mid-term'
      };
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