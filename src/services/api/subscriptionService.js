import mockSubscriptionData from "@/services/mockData/subscription.json";

class SubscriptionService {
  constructor() {
    this.delay = 300;
    this.currentSubscription = { ...mockSubscriptionData };
  }

  async getSubscription() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return { ...this.currentSubscription };
  }

  async upgrade(planId) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    if (planId === "premium") {
      this.currentSubscription = {
        ...this.currentSubscription,
        plan: "premium",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
      };
    }
    
    return { ...this.currentSubscription };
  }

  async downgrade() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    this.currentSubscription = {
      ...this.currentSubscription,
      plan: "free",
      status: "active",
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
    };
    
    return { ...this.currentSubscription };
  }

  hasFeature(feature, subscription = null) {
    const sub = subscription || this.currentSubscription;
    if (!sub || !sub.features) return false;
    return sub.features[feature] === true;
  }

  isFeatureLimited(feature, subscription = null) {
    const sub = subscription || this.currentSubscription;
    if (!sub || !sub.features) return true;
    const limit = sub.features[feature];
    return typeof limit === "number" && limit > 0;
  }

  getFeatureLimit(feature, subscription = null) {
    const sub = subscription || this.currentSubscription;
    if (!sub || !sub.features) return 0;
    const limit = sub.features[feature];
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
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    this.currentSubscription = {
      ...this.currentSubscription,
      status: "cancelled",
      cancelAtPeriodEnd: true
    };
    
    return { ...this.currentSubscription };
  }

  async reactivateSubscription() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    this.currentSubscription = {
      ...this.currentSubscription,
      status: "active",
      cancelAtPeriodEnd: false
    };
    
    return { ...this.currentSubscription };
  }
}

export default new SubscriptionService();