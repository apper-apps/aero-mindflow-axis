export const goalService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "image_url" } },
          { field: { Name: "affirmation" } },
          { field: { Name: "target_date" } },
          { field: { Name: "category" } },
          { field: { Name: "linked_habits" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("goal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching goals:", error);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "image_url" } },
          { field: { Name: "affirmation" } },
          { field: { Name: "target_date" } },
          { field: { Name: "category" } },
          { field: { Name: "linked_habits" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("goal", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching goal with ID ${id}:`, error);
      throw error;
    }
  },

  async create(goalData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

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

      const recordData = {
        Name: goalData.title,
        title: goalData.title,
        description: goalData.description || "",
        image_url: goalData.imageUrl || "",
        affirmation: goalData.affirmation || "",
        target_date: goalData.targetDate || null,
        category: category || 'mid-term',
        linked_habits: goalData.linkedHabits || ""
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("goal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create goal");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  },

  async update(id, goalData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

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

      const recordData = {
        Id: parseInt(id),
        Name: goalData.title,
        title: goalData.title,
        description: goalData.description || "",
        image_url: goalData.imageUrl || "",
        affirmation: goalData.affirmation || "",
        target_date: goalData.targetDate || null,
        category: category || 'mid-term',
        linked_habits: goalData.linkedHabits || ""
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("goal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update goal");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating goal:", error);
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

      const response = await apperClient.deleteRecord("goal", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw error;
    }
  }
};