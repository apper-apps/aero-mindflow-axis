export const habitService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "frequency" } },
          { field: { Name: "category" } },
          { field: { Name: "color" } },
          { field: { Name: "completions" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("habit", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching habits:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "frequency" } },
          { field: { Name: "category" } },
          { field: { Name: "color" } },
          { field: { Name: "completions" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("habit", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching habit with ID ${id}:`, error);
      throw error;
    }
  },

  async create(habitData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Name: habitData.name,
        description: habitData.description || "",
        frequency: habitData.frequency,
        category: habitData.category,
        color: habitData.color || "#6B46C1",
        completions: "{}"
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("habit", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create habit");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating habit:", error);
      throw error;
    }
  },

  async update(id, habitData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Id: parseInt(id),
        Name: habitData.name,
        description: habitData.description || "",
        frequency: habitData.frequency,
        category: habitData.category,
        color: habitData.color || "#6B46C1"
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("habit", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update habit");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating habit:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("habit", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting habit:", error);
      throw error;
    }
  },

  async toggleCompletion(id, date) {
    try {
      // First get the current habit data
      const habit = await this.getById(id);
      if (!habit) throw new Error("Habit not found");
      
      const dateStr = date.toISOString().split('T')[0];
      let completions = {};
      
      // Parse existing completions
      try {
        completions = JSON.parse(habit.completions || "{}");
      } catch (e) {
        completions = {};
      }
      
      // Increment completion count
      if (completions[dateStr]) {
        completions[dateStr] += 1;
      } else {
        completions[dateStr] = 1;
      }
      
      // Update the habit with new completions
      const updatedHabit = await this.update(id, {
        name: habit.Name,
        description: habit.description,
        frequency: habit.frequency,
        category: habit.category,
        color: habit.color,
        completions: JSON.stringify(completions)
      });
      
      return updatedHabit;
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      throw error;
    }
  }
};