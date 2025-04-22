import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import Stripe from "https://esm.sh/stripe@12.4.0";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase URL or service role key');
      return new Response(JSON.stringify({
        error: 'Server configuration error'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    // Get Stripe API key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('Missing Stripe secret key');
      return new Response(JSON.stringify({
        error: 'Server configuration error'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15'
    });
    // Get the signature from the request header
    const signature = req.headers.get('stripe-signature');
    // Get the raw request body as text
    const payload = await req.text();
    // Process the webhook without signature verification in development mode
    let event;
    try {
      // In development, we'll parse the payload directly if no signature is provided
      if (!signature) {
        event = JSON.parse(payload);
        console.log("Webhook received without signature verification (development mode)");
      } else {
        // Webhook secret is optional for development
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret) {
          console.warn("STRIPE_WEBHOOK_SECRET is not set, skipping signature verification");
          event = JSON.parse(payload);
        } else {
          event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
      }
    } catch (err) {
      console.error(`Webhook processing failed: ${err.message}`);
      return new Response(JSON.stringify({
        error: `Webhook processing failed: ${err.message}`
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    console.log(`Received event: ${event.type}`);
    // Handle different types of events
    switch(event.type){
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        {
          const subscription = event.data.object;
          // Get the organization ID from the subscription metadata
          let organizationId = subscription.metadata?.organization_id;
          let customerEmail = null;
          
          // If the organization ID is not in the metadata, get it from the customer
          if (!organizationId && subscription.customer) {
            const { data: orgData } = await supabaseClient.from('organizations').select('id').eq('stripe_customer_id', subscription.customer).maybeSingle();
            if (orgData) {
              organizationId = orgData.id;
            }
            
            // Get customer details for email
            try {
              const customer = await stripe.customers.retrieve(subscription.customer);
              if (customer && !customer.deleted) {
                customerEmail = customer.email;
              }
            } catch (error) {
              console.error("Error retrieving customer:", error);
            }
          }
          
          if (!organizationId) {
            console.error('Organization ID not found for subscription', subscription.id);
            return new Response(JSON.stringify({
              error: 'Organization ID not found'
            }), {
              status: 404,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          
          // Prepare update data
          const updateData = {
            subscription_tier: 'Pro', // Always set to Pro
            subscription_id: subscription.id,
            subscription_status: 'active', // Force status to active
            stripe_customer_id: subscription.customer,
            member_limit: 20, // Default to 20
            billing_email: customerEmail,
            status: 'active' // Also set organization status
          };
          
          // Update the organization with all fields
          const { data, error } = await supabaseClient.from('organizations')
            .update(updateData)
            .eq('id', organizationId)
            .select();
            
          if (error) {
            console.error('Update error:', error);
          } else {
            console.log('Updated organization:', data);
          }
          if (error) {
            console.error('Error updating organization subscription:', error);
            return new Response(JSON.stringify({
              error: 'Error updating organization subscription'
            }), {
              status: 500,
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            });
          }
          console.log(`Successfully updated subscription for organization ${organizationId}`);
          break;
        }
      case 'customer.subscription.deleted':
        {
          const subscription = event.data.object;
          // Get the organization with this subscription ID
          const { data: orgData, error } = await supabaseClient.from('organizations').select('id').eq('subscription_id', subscription.id).maybeSingle();
          if (error || !orgData) {
            console.error('Organization not found for subscription', subscription.id);
            break;
          }
          // Update the organization's subscription information
          await supabaseClient.from('organizations').update({
            subscription_tier: 'free',
            subscription_status: 'canceled'
          }).eq('id', orgData.id);
          console.log(`Subscription canceled for organization ${orgData.id}`);
          break;
        }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return new Response(JSON.stringify({
      received: true
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});