import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";

const Header = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-surface border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-100">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </h2>
            <p className="text-sm text-gray-400">
              {format(currentTime, "h:mm a")}
            </p>
          </div>
          {user && (
            <div className="hidden lg:flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary">
                <div className="w-full h-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">{t('profile.welcome', { name: user.firstName || 'User' })}</p>
                <p className="text-xs text-gray-400">{t('profile.personalized_experience')}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
            <ApperIcon name="Sunrise" size={16} />
            <span>
              {currentTime.getHours() < 12 ? t("common.good_morning") : currentTime.getHours() < 17 ? t("common.good_afternoon") : t("common.good_evening")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center space-x-2">
            <ApperIcon name="Globe" size={16} />
            <span className="text-sm font-medium">
              {i18n.language === "en" ? "DE" : "EN"}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2">
            <ApperIcon name="LogOut" size={16} />
            <span className="text-sm font-medium">Logout</span>
          </Button>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">{t("common.active")}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;