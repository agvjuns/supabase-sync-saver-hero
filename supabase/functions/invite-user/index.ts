/// <reference types="https://deno.land/types/lib.deno.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// This Edge Function invites a user to an organization using a magic link

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders
    });
  }
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Missing Authorization header', status: 401 }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401
      });
    }

    // Parse the request body to get the email and organizationId
    const { email, organizationId, role = 'user', name } = await req.json();

    if (!email || !organizationId) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Missing required fields: email and organizationId', status: 400 }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    // Initialize the Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Use the user's token to get their ID
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Invalid authentication token', status: 401 }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401
      });
    }

    // Check if user is an admin of the organization using the admin check RPC function
    // Assuming check_admin_role RPC exists and works correctly
    const { data: adminCheck, error: adminCheckError } = await supabaseAdmin.rpc(
      'check_admin_role',
      { p_org_id: organizationId, p_user_id: user.id }
    );

    if (adminCheckError || !adminCheck) {
      console.error('invite-user: Admin check failed', { userId: user.id, organizationId, adminCheckError, adminCheck });
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Only organization admins can invite users', status: 403 }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403
      });
    }

    // Check if the organization exists
    const { data: orgData, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id, member_limit, subscription_tier, name')
      .eq('id', organizationId)
      .single();
    if (orgError || !orgData) {
      console.error('invite-user: Organization not found or orgData is null', { organizationId, orgError, orgData });
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Organization not found', status: 404, organizationId, orgError, orgData }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404
      });
    }
    if (!orgData.name) {
      console.error('invite-user: Organization name is null', { organizationId, orgData });
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Organization name is null in organizations table', status: 500, organizationId, orgData }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }

    // Check if the member limit has been reached
    // Assuming get_organization_members_count RPC exists and works correctly
    const { data: memberCount, error: countError } = await supabaseAdmin.rpc('get_organization_members_count', {
      org_id: organizationId
    });
    if (countError) {
      console.error('invite-user: Failed to get member count', { organizationId, countError });
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Failed to verify member count', status: 500, details: countError.message }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }
    const memberLimit = orgData.member_limit || (orgData.subscription_tier === 'free' ? 5 : 999); // Default to 5 for free tier if limit is null
    if (memberCount !== null && memberCount >= memberLimit) { // Check if memberCount is not null before comparing
      return new Response(JSON.stringify({
        success: false,
        error: { message: `Organization member limit (${memberLimit}) reached. Current members: ${memberCount}`, status: 400 }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    // Check if user is already in the organization_members table (pending or active)
    const { data: existingMember, error: memberCheckError } = await supabaseAdmin
      .from('organization_members')
      .select('id, status')
      .eq('email', email)
      .eq('organization_id', organizationId)
      .maybeSingle();
    if (memberCheckError) {
      console.error('invite-user: Failed to check if user is already a member', { email, organizationId, memberCheckError });
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Failed to check if user is already a member', status: 500, details: memberCheckError.message }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      });
    }
    if (existingMember) {
      let message = 'User is already a member of this organization.';
      if (existingMember.status === 'pending') {
        message = 'User has already been invited to this organization.';
      }
      return new Response(JSON.stringify({
        success: false,
        error: { message: message, status: 400 }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      });
    }

    // Get the site URL from env
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000';

    // Generate custom redirect URL with organization info
    const redirectTo = `${siteUrl}/accept-invite?organizationId=${organizationId}&role=${role}&organizationName=${encodeURIComponent(orgData.name)}&setPassword=true`;

    console.log('invite-user: redirectTo value being sent:', redirectTo);
    console.log('invite-user: About to send inviteUserByEmail', {
      email,
      organizationId,
      orgData,
      redirectTo,
      role,
      name,
      inviteMeta: {
        organization_id: organizationId,
        role: role,
        invited: true,
        joining_organization: orgData.name,
        full_name: name || email // Provide full_name if available, fallback to email
      }
    });

    // Use Supabase Auth admin API to send invitation email with enhanced metadata
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: redirectTo,
      data: {
        organization_id: organizationId,
        role: role,
        invited: true,
        joining_organization: orgData.name,
        full_name: name || email // Provide full_name if available, fallback to email
      }
    });
    if (inviteError) {
      console.error('invite-user: Error sending invitation email', { email, organizationId, inviteError });
      // Check for "already been registered" error
      const errorString = JSON.stringify(inviteError);
      if (errorString.includes("already been registered")) {
         // If user is already in auth.users but not in organization_members (checked earlier),
         // this means they exist but haven't been invited to *this* organization before.
         // We should proceed to add them to organization_members as active.

         // Look up the user in Auth by email to get their user ID
        const { data: userLookup, error: userLookupError } = await supabaseAdmin.auth.admin.listUsers({ email });

        if (userLookupError || !userLookup || !userLookup.users || userLookup.users.length === 0) {
          console.error('invite-user: User already registered but could not be found in Auth', { email, userLookupError, userLookup });
          return new Response(JSON.stringify({
            success: false,
            error: { message: 'User already registered but could not be found in Auth', status: 500, details: userLookupError?.message }
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500
          });
        }

        const existingUser = userLookup.users[0];

        // Insert into organization_members as active for the existing user
        const { error: insertOrgMemberError } = await supabaseAdmin
          .from('organization_members')
          .insert({
            user_id: existingUser.id, // Link to the existing user ID
            organization_id: organizationId,
            email: email,
            role: role,
            status: 'active', // Set status to active immediately for existing users
            name: name || existingUser.user_metadata?.full_name || email // Use provided name, or existing full_name, or email
          });

        if (insertOrgMemberError) {
          console.error('invite-user: Failed to add existing user to organization_members', { email, organizationId, insertOrgMemberError });
          return new Response(JSON.stringify({
            success: false,
            error: { message: 'Failed to add existing user to organization members', status: 500, details: insertOrgMemberError.message }
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500
          });
        }

        // Return success response for existing user added to organization
        return new Response(JSON.stringify({
          success: true,
          message: 'User already registered. Added to organization members.',
          userId: existingUser.id // Optionally return the existing user ID
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });

      } else {
        // Handle other invitation errors from inviteUserByEmail
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              message: 'Failed to send invitation email',
              status: 500,
              details: (inviteError && typeof inviteError === "object" && "message" in inviteError) ? inviteError.message : errorString
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500
          }
        );
      }
    }

    // Record the invitation in the organization_members table with status 'pending' for new users
    const { error: insertError } = await supabaseAdmin
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        email: email,
        role: role,
        status: 'pending', // Status is pending until user accepts invite and is created in auth.users
        name: name // Ensure the name column is set
      });

    if (insertError) {
      console.error('invite-user: Error inserting invitation record', { email, organizationId, insertError });
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: 'Failed to record invitation', status: 500, details: insertError.message }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Return success response with the redirect link (optional, but useful for debugging/frontend)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation sent successfully',
        inviteLink: redirectTo // The magic link sent by Supabase Auth
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error: unknown) {
    console.error('invite-user: Unexpected error', { error });
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: 'Internal server error',
          status: 500,
          details: error instanceof Error ? error.message : 'An unknown error occurred'
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
