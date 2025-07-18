import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import PremiumBadge from "@/components/molecules/PremiumBadge";
import profileService from "@/services/api/profileService";

const Sidebar = ({ isOpen, onClose, subscription }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const userProfile = profileService.getProfile();
    setProfile(userProfile);
  }, []);
  const navItems = [
    { path: "/", icon: "Home", label: t('nav.dashboard') },
    { path: "/habits", icon: "CheckSquare", label: t('nav.habits') },
    { path: "/journal", icon: "BookOpen", label: t('nav.journal') },
{ path: "/goals", icon: "Target", label: t('nav.goals') },
    { path: "/calendar", icon: "Calendar", label: t('nav.calendar') },
    { path: "/profile", icon: "Settings", label: t('nav.profile') },
  ];
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-surface border-r border-gray-700 h-full">
<div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Sun" size={20} className="text-white" />
            </div>
<div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-100">{profile?.username || t('header.app_name')}</h1>
                {subscription?.plan === "premium" && <PremiumBadge size="xs" />}
              </div>
              <p className="text-xs text-gray-400">{profile?.username ? t('header.app_tagline') : t('header.app_tagline')}</p>
            </div>
            {profile && (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary ml-auto">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ApperIcon name="User" size={12} className="text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700/50 group",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white"
                      : "text-gray-300 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={cn(
                        "transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : "text-gray-400 group-hover:text-gray-300"
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
))}
          </nav>

          {subscription?.plan === "free" && (
            <div className="mt-8 p-4 bg-gradient-to-r from-premium-start/10 to-premium-end/10 rounded-lg border border-premium-start/20">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Crown" size={16} className="text-premium-start" />
                <span className="text-sm font-medium text-gray-100">{t('subscription.upgradeSidebar')}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">{t('subscription.unlockFeatures')}</p>
              <NavLink
                to="/profile"
                className="inline-flex items-center gap-1 text-xs text-premium-start hover:text-premium-end transition-colors"
              >
                {t('subscription.viewPlans')}
                <ApperIcon name="ArrowRight" size={12} />
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-gray-700 transform transition-transform duration-300">
            <div className="p-6">
<div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Sun" size={20} className="text-white" />
                  </div>
<div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold text-gray-100">{profile?.username || t('header.app_name')}</h1>
                      {subscription?.plan === "premium" && <PremiumBadge size="xs" />}
                    </div>
                    <p className="text-xs text-gray-400">{profile?.username ? t('header.app_tagline') : t('header.app_tagline')}</p>
                  </div>
                  {profile && (
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary ml-2">
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ApperIcon name="User" size={12} className="text-white" />
                        </div>
                      )}
</div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-400" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700/50 group",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white"
                          : "text-gray-300 hover:text-white"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <ApperIcon
                          name={item.icon}
                          size={20}
                          className={cn(
                            "transition-colors duration-200",
                            isActive
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-gray-300"
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
))}
              </nav>

              {subscription?.plan === "free" && (
                <div className="mt-8 p-4 bg-gradient-to-r from-premium-start/10 to-premium-end/10 rounded-lg border border-premium-start/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Crown" size={16} className="text-premium-start" />
                    <span className="text-sm font-medium text-gray-100">{t('subscription.upgradeSidebar')}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{t('subscription.unlockFeatures')}</p>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-xs text-premium-start hover:text-premium-end transition-colors"
                  >
                    {t('subscription.viewPlans')}
                    <ApperIcon name="ArrowRight" size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;