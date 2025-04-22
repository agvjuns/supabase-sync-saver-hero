
import { supabase } from '@/integrations/supabase/client';

export interface InvitationResult {
  success: boolean;
  message: string;
  inviteLink?: string;
}

/**
 * Invites a user to join the organization.
 * @param email The email address of the user to invite
 * @param role The role to assign to the user (default: 'user')
 * @param name The name of the user to invite (optional)
 * @param organizationId The ID of the organization to invite the user to
 */
export async function inviteTeamMember(
  email: string,
  role: string = 'user',
  name?: string,
  organizationId?: string
): Promise<InvitationResult> {
  try {
    // Get the current user's session to get the organization ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No active session');
      return {
        success: false,
        message: 'Session expired - please log in again'
      };
    }
    
    // If organizationId is provided directly, use it; otherwise fetch from profile
    let orgId = organizationId;
    
    if (!orgId) {
      // Query the profile table directly
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError || !profileData) {
        console.error('Error fetching user profile:', profileError);
        return {
          success: false,
          message: 'Could not retrieve your profile information'
        };
      }
      
      orgId = profileData.organization_id;
      
      if (!orgId) {
        console.error('No organization ID found for user');
        return {
          success: false,
          message: 'You are not associated with any organization'
        };
      }
    }
    
    console.log('Inviting user to organization:', { email, organizationId: orgId, role, name });

    // Call the existing invite-user edge function
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: { email, organizationId: orgId, role, name },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      // Try to extract as much detail as possible from the error and response
      let details = error.message || '';
      if (data?.error) {
        if (typeof data.error === 'string') {
          details += ` ${data.error}`;
        } else if (typeof data.error === 'object') {
          details += ` ${data.error.message || ''} ${data.error.details || ''}`;
        }
      }
      return {
        success: false,
        message: `Failed to send invitation: ${details || 'Unknown error'}`
      };
    }

    if (!data || !data.success) {
      let details = '';
      if (data?.error) {
        if (typeof data.error === 'string') {
          details = data.error;
        } else if (typeof data.error === 'object') {
          details = `${data.error.message || ''} ${data.error.details || ''}`;
        }
      }
      return {
        success: false,
        message: data?.error?.message || data?.error?.details || 'Failed to send invitation'
      };
    }
    
    console.log('Invitation sent successfully:', data);
    return {
      success: true,
      message: 'Invitation sent successfully!',
      inviteLink: data.inviteLink
    };

  } catch (error: any) {
    return {
      success: false,
      message: `Failed to send invitation: ${error.message || 'Unknown error'}`
    };
  }
}
