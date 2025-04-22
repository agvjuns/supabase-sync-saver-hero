
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { fetchUserProfile, fetchOrganization, updateUserProfile, UserProfile, Organization } from '@/services/profile/profileApi';
import { useProfilePicture } from './useProfilePicture';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userOrganization, setUserOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isUploading, uploadAvatar } = useProfilePicture();
  const { user } = useAuth();

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profile = await fetchUserProfile(user.id);
        
        if (profile) {
          setUserProfile(profile);
          
          if (profile.organization_id) {
            const org = await fetchOrganization(profile.organization_id);
            setUserOrganization(org);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [user]);

  const updateProfile = async (formData: { fullName: string }) => {
    if (!user) return false;
    
    try {
      setIsSaving(true);
      const success = await updateUserProfile(user.id, formData);
      
      // Update local state on success
      if (success) {
        setUserProfile(prev => prev ? {
          ...prev,
          full_name: formData.fullName
        } : null);
      }
      
      return success;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    const publicUrl = await uploadAvatar(file);
    
    // Update local state on success
    if (publicUrl && userProfile) {
      setUserProfile({
        ...userProfile,
        avatar_url: publicUrl
      });
    }
    
    return publicUrl;
  };

  return {
    userProfile,
    userOrganization,
    isLoading,
    isSaving,
    isUploading,
    updateUserProfile: updateProfile,
    uploadProfilePicture
  };
};
