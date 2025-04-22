
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Initialize the Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    // Get user from token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Error getting user from token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      );
    }
    
    // First call the delete_user_account RPC to clean up related data
    // Pass the user ID explicitly to the RPC function
    const { data: deleteRpcResult, error: deleteRpcError } = await supabaseAdmin.rpc(
      'delete_user_account',
      { user_id: user.id }
    );
    
    if (deleteRpcError) {
      console.error('Error in delete_user_account RPC:', deleteRpcError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete user data: ' + deleteRpcError.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    // Then delete the user from auth.users
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );
    
    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete user account: ' + deleteAuthError.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'User account deleted successfully',
        success: true
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Unexpected error in delete-user edge function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
