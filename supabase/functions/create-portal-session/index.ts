
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.9.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token or user not found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's profile and organization
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profileData) {
      console.error('Error fetching profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Could not find user profile' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is an admin by querying the organization_members table
    const { data: memberData, error: memberError } = await supabaseClient
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', profileData.organization_id)
      .single()

    if (memberError) {
      console.error('Error checking admin status:', memberError)
      return new Response(
        JSON.stringify({ error: 'Could not verify admin status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is an admin
    if (memberData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Only organization admins can manage billing' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const organizationId = profileData.organization_id

    // Get organization details
    const { data: orgData, error: orgError } = await supabaseClient
      .from('organizations')
      .select('stripe_customer_id, name, billing_email')
      .eq('id', organizationId)
      .single()

    if (orgError || !orgData) {
      console.error('Error fetching organization:', orgError)
      return new Response(
        JSON.stringify({ error: 'Could not find organization' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not set in environment variables')
      return new Response(
        JSON.stringify({ error: 'Stripe API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate Stripe key format
    if (!stripeSecretKey.startsWith('sk_')) {
      console.error('Invalid Stripe key format')
      return new Response(
        JSON.stringify({ error: 'Invalid Stripe API key format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    let { stripe_customer_id } = orgData

    // If the organization doesn't have a Stripe customer ID yet, create one
    if (!stripe_customer_id) {
      console.log('Creating new Stripe customer for organization')
      try {
        const customer = await stripe.customers.create({
          name: orgData.name,
          email: orgData.billing_email || user.email,
          metadata: {
            organization_id: organizationId
          }
        })
        
        stripe_customer_id = customer.id
        
        // Update the organization with the new Stripe customer ID
        const { error: updateError } = await supabaseClient
          .from('organizations')
          .update({ stripe_customer_id })
          .eq('id', organizationId)
        
        if (updateError) {
          console.error('Error updating organization with Stripe customer ID:', updateError)
        }
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        return new Response(
          JSON.stringify({ error: `Failed to create Stripe customer: ${stripeError.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Read request data
    let requestData = {}
    try {
      requestData = await req.json()
    } catch (e) {
      // If JSON parsing fails, use empty object
      console.log('No request body or invalid JSON')
    }
    
    const { action = 'portal', priceId, returnUrl = req.headers.get('origin') ? `${req.headers.get('origin')}/organization` : 'http://localhost:3000/organization' } = requestData;

    // Handle different actions based on the request
    if (action === 'checkout') {
      try {
        // Use the provided priceId or the specific price ID from the user
        const checkoutPriceId = priceId || 'price_1R97TyBR00pIJOBNWJBXeIKe' // Using the price ID provided by the user
        
        const session = await stripe.checkout.sessions.create({
          customer: stripe_customer_id,
          line_items: [
            {
              price: checkoutPriceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${returnUrl}?checkout_success=true`,
          cancel_url: `${returnUrl}?checkout_cancelled=true`,
          subscription_data: {
            metadata: {
              organization_id: organizationId
            }
          }
        })

        console.log('Created Stripe checkout session:', session.url)

        return new Response(
          JSON.stringify({ url: session.url }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (stripeError) {
        console.error('Error creating Stripe checkout session:', stripeError)
        return new Response(
          JSON.stringify({ 
            error: `Failed to create checkout session: ${stripeError.message}`,
            details: 'Please ensure your Stripe account is properly set up and the price ID is valid.'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      // Portal session (original functionality)
      try {
        // Try to create a new Stripe billing portal session
        const session = await stripe.billingPortal.sessions.create({
          customer: stripe_customer_id,
          return_url: returnUrl,
        })

        console.log('Created Stripe portal session:', session.url)

        return new Response(
          JSON.stringify({ url: session.url }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (stripeError) {
        console.error('Error creating Stripe portal session:', stripeError)
        
        // If the Customer Portal is not configured, return a test checkout URL instead
        if (stripeError.message && 
           (stripeError.message.includes('customer portal') || 
            stripeError.message.includes('portal settings'))) {
          
          // Try to create a checkout session instead
          try {
            const checkoutPriceId = 'price_1R97TyBR00pIJOBNWJBXeIKe' // Using the price ID provided by the user
            
            const checkoutSession = await stripe.checkout.sessions.create({
              customer: stripe_customer_id,
              line_items: [
                {
                  price: checkoutPriceId,
                  quantity: 1,
                },
              ],
              mode: 'subscription',
              success_url: `${returnUrl}?checkout_success=true`,
              cancel_url: `${returnUrl}?checkout_cancelled=true`,
            })
            
            console.log('Created Stripe checkout session as fallback:', checkoutSession.url)
            
            return new Response(
              JSON.stringify({ 
                url: checkoutSession.url,
                message: 'Using checkout session instead of portal',
                details: 'Stripe Customer Portal is not fully configured, using checkout session instead.'
              }),
              { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          } catch (checkoutError) {
            console.error('Error creating fallback checkout session:', checkoutError)
            
            return new Response(
              JSON.stringify({ 
                error: 'Stripe Customer Portal is not configured properly. Please set up your Customer Portal in the Stripe Dashboard.',
                details: stripeError.message,
                setupUrl: 'https://dashboard.stripe.com/test/settings/billing/portal'
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
        
        return new Response(
          JSON.stringify({ 
            error: `Failed to create portal session: ${stripeError.message}`,
            details: 'Please ensure your Stripe account is properly set up and the Customer Portal is configured.'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: `An unexpected error occurred: ${error.message}`,
        details: 'Please check the edge function logs for more information.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
