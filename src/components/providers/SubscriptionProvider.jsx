import { createContext, useContext, useState, useEffect } from "react";
import subscriptionService from "@/services/api/subscriptionService";

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const userSubscription = await subscriptionService.getSubscription();
        setSubscription(userSubscription);
      } catch (error) {
        console.error("Error loading subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const hasFeature = (feature) => {
    return subscriptionService.hasFeature(feature, subscription);
  };

  const isFeatureLimited = (feature) => {
    return subscriptionService.isFeatureLimited(feature, subscription);
  };

  const getFeatureLimit = (feature) => {
    return subscriptionService.getFeatureLimit(feature, subscription);
  };

  const upgrade = async (planId) => {
    try {
      const newSubscription = await subscriptionService.upgrade(planId);
      setSubscription(newSubscription);
      return newSubscription;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    subscription,
    loading,
    hasFeature,
    isFeatureLimited,
    getFeatureLimit,
    upgrade,
    isPremium: subscription?.plan === "premium",
    isFree: subscription?.plan === "free" || !subscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;