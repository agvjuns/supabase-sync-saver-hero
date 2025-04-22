
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateRoleRequest {
  userId: string;
  role: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with the service role key (this has admin privileges)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase client');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Verify the requesting user is authenticated and get their user info
    const { data: { user: requestingUser }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !requestingUser) {
      throw new Error('Unauthorized request: ' + (authError?.message || 'Invalid user'));
    }

    // Get the requesting user's role to check if they have admin privileges
    const { data: requestingUserProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', requestingUser.id)
      .single();

    if (profileError || !requestingUserProfile) {
      throw new Error('Could not retrieve requesting user profile: ' + (profileError?.message || 'Profile not found'));
    }

    // Verify the requesting user is an admin
    if (requestingUserProfile.role !== 'admin') {
      throw new Error('Only admins can manage user roles');
    }

    // Now we know the user is authorized to manage roles
    if (req.method === 'POST') {
      // Parse the request body
      const { userId, role } = await req.json() as UpdateRoleRequest;
      
      if (!userId || !role) {
        throw new Error('Missing required fields: userId and role');
      }

      // Check if the target user exists and is in the same organization
      const { data: targetUserProfile, error: targetUserError } = await supabase
        .rpc('check_same_organization', { user_id: userId });

      if (targetUserError || !targetUserProfile) {
        throw new Error('User is not in your organization or does not exist');
      }

      // Valid roles
      const validRoles = ['admin', 'user'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
      }

      // Update the user's role
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) {
        throw new Error('Error updating user role: ' + error.message);
      }

      // Return success response
      return new Response(
        JSON.stringify({ success: true, message: `User role updated to ${role}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (req.method === 'GET') {
      // Get users from the same organization as the requesting user
      const { data: orgId } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', requestingUser.id)
        .single();

      if (!orgId) {
        throw new Error('Could not determine organization');
      }

      // Get all users in the same organization
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('organization_id', orgId.organization_id);

      if (usersError) {
        throw new Error('Error fetching users: ' + usersError.message);
      }

      // Return the users
      return new Response(
        JSON.stringify({ users }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error(`Unsupported method: ${req.method}`);
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
