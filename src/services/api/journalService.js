export const journalService = {
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
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "content" } },
          { field: { Name: "mood" } },
          { field: { Name: "image_url" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("journal_entry", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching journal entries:", error);
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
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "content" } },
          { field: { Name: "mood" } },
          { field: { Name: "image_url" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("journal_entry", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching journal entry with ID ${id}:`, error);
      throw error;
    }
  },

  async getByDate(date) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const dateStr = date.toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "content" } },
          { field: { Name: "mood" } },
          { field: { Name: "image_url" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "StartsWith",
            Values: [dateStr]
          }
        ]
      };

      const response = await apperClient.fetchRecords("journal_entry", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching journal entries by date:", error);
      throw error;
    }
  },

  async create(entryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let imageUrl = null;
      if (entryData.image) {
        // In a real app, you would upload to cloud storage
        // For now, we'll create a mock URL
        imageUrl = `mock-image-${Date.now()}`;
      }

      const recordData = {
        Name: `${entryData.type} entry - ${new Date(entryData.date).toLocaleDateString()}`,
        type: entryData.type,
        date: entryData.date,
        content: entryData.content,
        mood: entryData.mood,
        image_url: imageUrl,
        Tags: Array.isArray(entryData.tags) ? entryData.tags.join(",") : entryData.tags || ""
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("journal_entry", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create journal entry");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating journal entry:", error);
      throw error;
    }
  },

  async update(id, entryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let imageUrl = entryData.imageUrl;
      if (entryData.image) {
        // Handle new image upload
        imageUrl = `mock-image-${id}-${Date.now()}`;
      } else if (entryData.image === null) {
        imageUrl = null;
      }

      const recordData = {
        Id: parseInt(id),
        Name: `${entryData.type} entry - ${new Date(entryData.date).toLocaleDateString()}`,
        type: entryData.type,
        date: entryData.date,
        content: entryData.content,
        mood: entryData.mood,
        image_url: imageUrl,
        Tags: Array.isArray(entryData.tags) ? entryData.tags.join(",") : entryData.tags || ""
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("journal_entry", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update journal entry");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating journal entry:", error);
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

      const response = await apperClient.deleteRecord("journal_entry", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      throw error;
    }
  }
};