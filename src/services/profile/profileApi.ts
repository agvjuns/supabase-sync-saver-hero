
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  organization_id: string;
  role: string;
  avatar_url?: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  subscription_tier: string;
  stripe_customer_id?: string;
  subscription_status?: string;
  member_limit?: number;
  billing_email?: string;
}

/**
 * Fetches user profile data for the given user ID
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log("Fetching profile for user:", userId);
    
    // Direct query to profiles table instead of using RPC
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
        
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      toast.error('Failed to load user profile: ' + profileError.message);
      return null;
    }
    
    if (profileData) {
      console.log("Profile fetched successfully:", profileData);
      
      // If there's an avatar_url, make sure it's using the correct public URL format
      if (profileData.avatar_url) {
        console.log("Avatar URL from database:", profileData.avatar_url);
      }
      
      return profileData as UserProfile;
    } else {
      console.error("No profile found for user");
      toast.error('User profile not found');
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    toast.error('Failed to load user profile: ' + (error.message || 'Unknown error'));
    return null;
  }
}

/**
 * Fetches organization data for the given organization ID
 */
export async function fetchOrganization(orgId: string): Promise<Organization | null> {
  try {
    console.log("Fetching organization:", orgId);
    
    // Direct query with the new RLS policies that prevent recursion
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .maybeSingle();
      
    if (orgError) {
      console.error("Error fetching organization:", orgError);
      toast.error('Failed to load organization: ' + orgError.message);
      return null;
    }
    
    if (orgData) {
      console.log("Organization fetched successfully:", orgData);
      return orgData as Organization;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching organization:', error);
    toast.error('Failed to load organization: ' + (error.message || 'Unknown error'));
    return null;
  }
}

/**
 * Updates a user profile with the given data
 */
export async function updateUserProfile(userId: string, formData: { fullName: string }): Promise<boolean> {
  try {
    console.log("Saving profile for user:", userId);
    
    // Use direct update instead of RPC function
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.fullName,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
      return false;
    }
    
    toast.success('Profile updated successfully');
    return true;
    
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    return false;
  }
}

/**
 * Uploads a profile picture for the given user
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;
    
    console.log("Uploading profile picture:", filePath);
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      toast.error(`Failed to upload profile picture: ${uploadError.message || 'Unknown error'}`);
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    console.log("File uploaded, public URL:", publicUrl);
    
    // Update profile with avatar URL using direct update
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating profile with avatar URL:", updateError);
      toast.error(`Failed to update profile with new avatar: ${updateError.message || 'Unknown error'}`);
      return null;
    }
    
    toast.success('Profile picture updated successfully');
    return publicUrl;
    
  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    toast.error(`Failed to upload profile picture: ${error.message || 'Unknown error'}`);
    return null;
  }
}
