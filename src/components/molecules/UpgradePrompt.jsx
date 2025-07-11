import { useTranslation } from "react-i18next";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { useSubscription } from "@/components/providers/SubscriptionProvider";

const UpgradePrompt = ({ feature, description, onUpgrade, className }) => {
  const { t } = useTranslation();
  const { upgrade } = useSubscription();

  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      try {
        await upgrade("premium");
      } catch (error) {
        console.error("Upgrade failed:", error);
      }
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-r from-premium-start/10 to-premium-end/10 border-premium-start/20 ${className}`}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-premium-start to-premium-end rounded-full flex items-center justify-center">
          <ApperIcon name="Crown" size={24} className="text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            {t('subscription.upgradeRequired')}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {description || t('subscription.upgradeDescription')}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-premium-start to-premium-end hover:from-premium-start/80 hover:to-premium-end/80"
          >
            <ApperIcon name="Crown" size={16} className="mr-2" />
            {t('subscription.upgradeToPremium')}
          </Button>
          
          <p className="text-xs text-gray-500">
            {t('subscription.upgradeSubtext')}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default UpgradePrompt;