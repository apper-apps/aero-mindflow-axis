class SubscriptionService {
  constructor() {
    this.delay = 300;
  }

  async getSubscription() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } },
          { field: { Name: "plan" } },
          { field: { Name: "status" } },
          { field: { Name: "current_period_start" } },
          { field: { Name: "current_period_end" } },
          { field: { Name: "cancel_at_period_end" } },
          { field: { Name: "features" } },
          { field: { Name: "billing" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords("app_subscription", params);
      
      if (!response.success) {
        console.error(response.message);
        // Return default free subscription if no subscription found
        return this.getDefaultSubscription();
      }

      if (response.data && response.data.length > 0) {
        const subscription = response.data[0];
        return {
          ...subscription,
          features: JSON.parse(subscription.features || '{}'),
          billing: JSON.parse(subscription.billing || '{}')
        };
      }

      // Return default free subscription if no subscription found
      return this.getDefaultSubscription();
    } catch (error) {
      console.error("Error fetching subscription:", error);
      return this.getDefaultSubscription();
    }
  }

  getDefaultSubscription() {
    return {
      Id: null,
      plan: "free",
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: false,
      features: {
        maxGoals: 3,
        maxHabits: 5,
        advancedAnalytics: false,
        premiumThemes: false,
        exportData: false,
        prioritySupport: false,
        customCategories: false,
        habitTemplates: false
      },
      billing: {
        amount: 0,
        currency: "USD",
        interval: "month"
      }
    };
  }

  async upgrade(planId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const currentSubscription = await this.getSubscription();
      
      const features = {
        maxGoals: -1,
        maxHabits: -1,
        advancedAnalytics: true,
        premiumThemes: true,
        exportData: true,
        prioritySupport: true,
        customCategories: true,
        habitTemplates: true
      };

      const billing = {
        amount: 9.99,
        currency: "USD",
        interval: "month"
      };

      const recordData = {
        Name: `${planId} subscription`,
        plan: planId,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false,
        features: JSON.stringify(features),
        billing: JSON.stringify(billing)
      };

      let response;
      if (currentSubscription.Id) {
        // Update existing subscription
        recordData.Id = currentSubscription.Id;
        const params = { records: [recordData] };
        response = await apperClient.updateRecord("app_subscription", params);
      } else {
        // Create new subscription
        const params = { records: [recordData] };
        response = await apperClient.createRecord("app_subscription", params);
      }

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return {
        ...recordData,
        features,
        billing
      };
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      throw error;
    }
  }

  async downgrade() {
    try {
      const currentSubscription = await this.getSubscription();
      if (!currentSubscription.Id) {
        return this.getDefaultSubscription();
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const features = {
        maxGoals: 3,
        maxHabits: 5,
        advancedAnalytics: false,
        premiumThemes: false,
        exportData: false,
        prioritySupport: false,
        customCategories: false,
        habitTemplates: false
      };

      const billing = {
        amount: 0,
        currency: "USD",
        interval: "month"
      };

      const recordData = {
        Id: currentSubscription.Id,
        Name: "free subscription",
        plan: "free",
        status: "active",
        features: JSON.stringify(features),
        billing: JSON.stringify(billing)
      };

      const params = { records: [recordData] };
      const response = await apperClient.updateRecord("app_subscription", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return {
        ...recordData,
        features,
        billing
      };
    } catch (error) {
      console.error("Error downgrading subscription:", error);
      throw error;
    }
  }

  hasFeature(feature, subscription = null) {
    if (!subscription) return false;
    if (!subscription.features) return false;
    return subscription.features[feature] === true;
  }

  isFeatureLimited(feature, subscription = null) {
    if (!subscription || !subscription.features) return true;
    const limit = subscription.features[feature];
    return typeof limit === "number" && limit > 0;
  }

  getFeatureLimit(feature, subscription = null) {
    if (!subscription || !subscription.features) return 0;
    const limit = subscription.features[feature];
    return typeof limit === "number" ? limit : (limit ? -1 : 0);
  }

  getPlanFeatures(planId) {
    const plans = {
      free: {
        name: "Free",
        price: 0,
        features: {
          maxGoals: 3,
          maxHabits: 5,
          advancedAnalytics: false,
          premiumThemes: false,
          exportData: false,
          prioritySupport: false,
          customCategories: false,
          habitTemplates: false
        }
      },
      premium: {
        name: "Premium",
        price: 9.99,
        features: {
          maxGoals: -1,
          maxHabits: -1,
          advancedAnalytics: true,
          premiumThemes: true,
          exportData: true,
          prioritySupport: true,
          customCategories: true,
          habitTemplates: true
        }
      }
    };
    
    return plans[planId] || plans.free;
  }

  async cancelSubscription() {
    try {
      const currentSubscription = await this.getSubscription();
      if (!currentSubscription.Id) {
        return this.getDefaultSubscription();
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Id: currentSubscription.Id,
        status: "cancelled",
        cancel_at_period_end: true
      };

      const params = { records: [recordData] };
      const response = await apperClient.updateRecord("app_subscription", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return {
        ...currentSubscription,
        status: "cancelled",
        cancel_at_period_end: true
      };
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error;
    }
  }

  async reactivateSubscription() {
    try {
      const currentSubscription = await this.getSubscription();
      if (!currentSubscription.Id) {
        return this.getDefaultSubscription();
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Id: currentSubscription.Id,
        status: "active",
        cancel_at_period_end: false
      };

      const params = { records: [recordData] };
      const response = await apperClient.updateRecord("app_subscription", params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return {
        ...currentSubscription,
        status: "active",
        cancel_at_period_end: false
      };
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      throw error;
    }
  }
}

export default new SubscriptionService();