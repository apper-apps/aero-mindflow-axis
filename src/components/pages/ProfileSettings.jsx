import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import PremiumBadge from "@/components/molecules/PremiumBadge";
import profileService from "@/services/api/profileService";
import { useSubscription } from "@/components/providers/SubscriptionProvider";

function ProfileSettings() {
  const { t } = useTranslation();
  const { subscription, upgrade, isPremium, isFree } = useSubscription();
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: null,
    notifications: {
      email: true,
      push: true,
      habitReminders: true,
      goalDeadlines: true,
      journalPrompts: false
    },
    privacy: {
      profileVisibility: 'public',
      shareProgress: true,
      shareJournal: false
    }
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await profileService.getProfile()
        if (userProfile) {
          setProfile(prev => ({
            ...prev,
            ...userProfile
          }))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }
    loadProfile()
  }, [])

  const validateForm = () => {
    const newErrors = {}
    
    if (!profile.username?.trim()) {
      newErrors.username = t('profileSettings.usernameRequired')
    }
    
    if (!profile.email?.trim()) {
      newErrors.email = t('profileSettings.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = t('profileSettings.emailInvalid')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    if (!field || value === undefined) return
    
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateFile = (file) => {
    if (!file) return false
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('profileSettings.invalidFileType'))
      return false
    }
    
    if (file.size > maxSize) {
      toast.error(t('profileSettings.fileTooLarge'))
      return false
    }
    
    return true
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !validateFile(file)) return

    try {
      setLoading(true)
      const imageUrl = await profileService.uploadProfilePicture(file)
      
      if (imageUrl) {
        setProfile(prev => ({
          ...prev,
          profilePicture: imageUrl
        }))
        toast.success(t('profileSettings.pictureUpdated'))
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error(t('profileSettings.pictureUploadError'))
    } finally {
      setLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setLoading(true)
      setErrors({})
      
      const updatedProfile = await profileService.updateProfile(profile)
      if (updatedProfile) {
        setProfile(updatedProfile)
        toast.success(t('profileSettings.profileUpdated'))
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(t('profileSettings.updateError'))
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePicture = () => {
    setProfile(prev => ({
      ...prev,
      profilePicture: null
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">
          {t('profileSettings.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Picture Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            {t('profileSettings.profilePicture')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                  <ApperIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                <ApperIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {t('profileSettings.changePicture')}
              </Button>
              {profile.profilePicture && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemovePicture}
                  disabled={loading}
                >
                  {t('profileSettings.removePicture')}
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            {t('profileSettings.basicInfo')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label={t('profileSettings.username')}
              type="text"
              value={profile.username || ''}
              onChange={(e) => handleInputChange('username', e.target.value)}
              error={errors.username}
              placeholder={t('profileSettings.usernamePlaceholder')}
              required
            />
            <FormField
              label={t('profileSettings.email')}
              type="email"
              value={profile.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder={t('profileSettings.emailPlaceholder')}
              required
            />
            <FormField
              label={t('profileSettings.bio')}
              multiline
              value={profile.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              error={errors.bio}
              placeholder={t('profileSettings.bioPlaceholder')}
              rows={3}
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? t('common.saving') : t('common.save')}
            </Button>
          </form>
</Card>

        {/* Subscription Management */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-100">
              {t('subscription.title')}
            </h2>
            {isPremium && <PremiumBadge />}
          </div>

          <div className="space-y-6">
            {/* Current Plan */}
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-100">
                    {subscription?.plan === "premium" ? t('subscription.premiumPlan') : t('subscription.freePlan')}
                  </h3>
                  {isPremium && <ApperIcon name="Crown" size={16} className="text-premium-start" />}
                </div>
                <p className="text-sm text-gray-400">
                  {subscription?.plan === "premium" 
                    ? t('subscription.premiumDescription') 
                    : t('subscription.freeDescription')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-100">
                  {subscription?.plan === "premium" ? "$9.99" : "$0"}
                </p>
                <p className="text-sm text-gray-400">
                  {subscription?.plan === "premium" ? t('subscription.perMonth') : t('subscription.forever')}
                </p>
              </div>
            </div>

            {/* Plan Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isFree && (
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <h4 className="font-medium text-gray-100 mb-3">{t('subscription.freeFeatures')}</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">
                      <ApperIcon name="Check" size={14} className="text-success" />
                      {t('subscription.features.basicTracking')}
                    </li>
                    <li className="flex items-center gap-2">
                      <ApperIcon name="Check" size={14} className="text-success" />
                      {t('subscription.features.limitedGoals', { count: 3 })}
                    </li>
                    <li className="flex items-center gap-2">
                      <ApperIcon name="Check" size={14} className="text-success" />
                      {t('subscription.features.limitedHabits', { count: 5 })}
                    </li>
                  </ul>
                </div>
              )}

              <div className="p-4 bg-gradient-to-r from-premium-start/10 to-premium-end/10 rounded-lg border border-premium-start/20">
                <h4 className="font-medium text-gray-100 mb-3 flex items-center gap-2">
                  <ApperIcon name="Crown" size={16} className="text-premium-start" />
                  {t('subscription.premiumFeatures')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <ApperIcon name="Check" size={14} className="text-premium-start" />
                    {t('subscription.features.unlimitedGoals')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ApperIcon name="Check" size={14} className="text-premium-start" />
                    {t('subscription.features.unlimitedHabits')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ApperIcon name="Check" size={14} className="text-premium-start" />
                    {t('subscription.features.advancedAnalytics')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ApperIcon name="Check" size={14} className="text-premium-start" />
                    {t('subscription.features.premiumThemes')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ApperIcon name="Check" size={14} className="text-premium-start" />
                    {t('subscription.features.exportData')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {isFree ? (
                <Button
                  onClick={() => upgrade("premium")}
                  className="bg-gradient-to-r from-premium-start to-premium-end hover:from-premium-start/80 hover:to-premium-end/80"
                  disabled={loading}
                >
                  <ApperIcon name="Crown" size={16} className="mr-2" />
                  {t('subscription.upgradeToPremium')}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toast.info(t('subscription.manageSubscription'))}
                  >
                    <ApperIcon name="Settings" size={16} className="mr-2" />
                    {t('subscription.manageBilling')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.info(t('subscription.cancelSubscription'))}
                  >
                    {t('subscription.cancel')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ProfileSettings