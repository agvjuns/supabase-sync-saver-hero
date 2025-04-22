
import { supabase } from '@/integrations/supabase/client';

/**
 * Get user's organization ID
 */
export const getUserOrganizationId = async (userId: string): Promise<string> => {
  try {
    if (!userId) {
      throw new Error('No user ID provided');
    }
    
    // Direct query instead of using RPC
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error(profileError.message);
    }
    
    if (!profileData || !profileData.organization_id) {
      throw new Error('No organization found for user');
    }
    
    return profileData.organization_id;
  } catch (err: any) {
    console.error('Error getting user organization:', err);
    throw err;
  }
};
