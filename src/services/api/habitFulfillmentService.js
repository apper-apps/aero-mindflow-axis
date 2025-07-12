export const habitFulfillmentService = {
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
          { 
            field: { name: "habit" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date_fulfilled" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "date_fulfilled", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("habit_fulfillment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching habit fulfillments:", error);
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
          { 
            field: { name: "habit" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date_fulfilled" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await apperClient.getRecordById("habit_fulfillment", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching habit fulfillment with ID ${id}:`, error);
      throw error;
    }
  },

  async create(fulfillmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Name: fulfillmentData.name || `Fulfillment for ${fulfillmentData.date_fulfilled}`,
        habit: parseInt(fulfillmentData.habitId),
        date_fulfilled: fulfillmentData.date_fulfilled
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord("habit_fulfillment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create habit fulfillment");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating habit fulfillment:", error);
      throw error;
    }
  },

  async update(id, fulfillmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Id: parseInt(id),
        Name: fulfillmentData.name,
        habit: parseInt(fulfillmentData.habitId),
        date_fulfilled: fulfillmentData.date_fulfilled
      };

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord("habit_fulfillment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update habit fulfillment");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating habit fulfillment:", error);
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

      const response = await apperClient.deleteRecord("habit_fulfillment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting habit fulfillment:", error);
      throw error;
    }
  },

  async getTodaysFulfillments() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const today = new Date().toISOString().split('T')[0];

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { 
            field: { name: "habit" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "date_fulfilled" } }
        ],
        where: [
          {
            FieldName: "date_fulfilled",
            Operator: "EqualTo",
            Values: [today]
          }
        ]
      };

      const response = await apperClient.fetchRecords("habit_fulfillment", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's habit fulfillments:", error);
      throw error;
    }
  }
};