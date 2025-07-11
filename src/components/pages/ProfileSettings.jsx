import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import profileService from "@/services/api/profileService";

const ProfileSettings = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(() => profileService.getProfile());
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile.username,
    profilePicture: profile.profilePicture
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error(t('profile.file_too_large'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error(t('profile.invalid_file_type'));
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await profileService.uploadProfilePicture(file);
      setFormData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));
      toast.success(t('profile.picture_uploaded'));
    } catch (error) {
      toast.error(t('profile.upload_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error(t('profile.username_required'));
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = await profileService.updateProfile(formData);
      setProfile(updatedProfile);
      toast.success(t('profile.profile_updated'));
      
      // Force re-render of other components that use profile
      window.location.reload();
    } catch (error) {
      toast.error(t('profile.update_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          {t('profile.title')}
        </h1>
        <p className="text-gray-400">
          {t('profile.subtitle')}
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="text-center">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary relative">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ApperIcon name="User" size={32} className="text-white" />
                  </div>
                )}
                {formData.profilePicture && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <ApperIcon name="X" size={14} className="text-white" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Upload" size={16} />
                <span>{t('profile.upload_picture')}</span>
              </Button>
              
              {formData.profilePicture && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemovePicture}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white"
                >
                  <ApperIcon name="Trash2" size={16} />
                  <span>{t('profile.remove_picture')}</span>
                </Button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <p className="text-xs text-gray-400 mt-2">
              {t('profile.picture_requirements')}
            </p>
          </div>

          {/* Username Section */}
          <FormField
            label={t('profile.username')}
            required
            className="space-y-2"
          >
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder={t('profile.username_placeholder')}
              className="w-full"
              disabled={loading}
            />
            <p className="text-xs text-gray-400">
              {t('profile.username_description')}
            </p>
          </FormField>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-700">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
              <span>{loading ? t('common.loading') : t('profile.save_changes')}</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Profile Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          {t('profile.preview')}
        </h3>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary">
            {formData.profilePicture ? (
              <img 
                src={formData.profilePicture} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-100">
              {formData.username || t('profile.default_username')}
            </p>
            <p className="text-sm text-gray-400">
              {t('profile.member_since')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettings;