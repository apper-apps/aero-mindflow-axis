const PROFILE_KEY = 'mindflow_user_profile';

const defaultProfile = {
  username: 'MindFlow User',
  profilePicture: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const profileService = {
  getProfile: () => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultProfile;
    } catch (error) {
      console.error('Error loading profile:', error);
      return defaultProfile;
    }
  },

  updateProfile: async (profileData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const currentProfile = profileService.getProfile();
          const updatedProfile = {
            ...currentProfile,
            ...profileData,
            updatedAt: new Date().toISOString()
          };
          
          localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
          resolve(updatedProfile);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  },

  uploadProfilePicture: async (file) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read file'));
          };
          reader.readAsDataURL(file);
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  },

  resetProfile: () => {
    try {
      localStorage.removeItem(PROFILE_KEY);
      return defaultProfile;
    } catch (error) {
      console.error('Error resetting profile:', error);
      return defaultProfile;
    }
  }
};

export default profileService;