
import { useState } from 'react';
import { uploadProfilePicture } from '@/services/profile/profileApi';
import { useAuth } from './useAuth';

export const useProfilePicture = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    try {
      setIsUploading(true);
      return await uploadProfilePicture(user.id, file);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadAvatar
  };
};
