/// <reference types="https://deno.land/types/lib.deno.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@14.10.0?target=deno";
import { corsHeaders } from "../_shared/cors.ts";

// This Edge Function handles Stripe webhook events

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders
    });
  }

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    apiVersion: '2023-10-16', // Use your desired Stripe API version
    typescript: true,
  });

  const signature = req.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    console.error('Stripe-Webhook: Missing Stripe-Signature header or STRIPE_WEBHOOK_SECRET environment variable');
    return new Response(JSON.stringify({ received: false, error: 'Missing signature or secret' }), { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Stripe-Webhook: Webhook signature verification failed.', err.message);
    return new Response(JSON.stringify({ received: false, error: err.message }), { status: 400 });
  }

  // Initialize the Supabase client with the service role key
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string; // Assuming customer is always a string ID here

        // Retrieve the customer to get the organization ID from metadata
        const stripeCustomer = await stripe.customers.retrieve(customerId);
        const organizationId = stripeCustomer.metadata.organizationId;

        if (!organizationId) {
          console.error('Stripe-Webhook: Customer metadata missing organizationId', { customerId });
          return new Response(JSON.stringify({ received: true, error: 'Customer metadata missing organizationId' }), { status: 400 });
        }

        // Find the product to get the member limit and subscription tier
        const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);
        const memberLimit = product.metadata.member_limit ? parseInt(product.metadata.member_limit as string, 10) : null;
        const subscriptionTier = product.metadata.subscription_tier as string || 'pro'; // Default to 'pro' if not set

        // Update the organization in the database
        const { error: updateError } = await supabaseAdmin
          .from('organizations')
          .update({
            stripe_customer_id: customerId,
            subscription_status: subscription.status,
            subscription_tier: subscriptionTier,
            member_limit: memberLimit,
            updated_at: new Date().toISOString(), // Update updated_at timestamp
          })
          .eq('id', organizationId);

        if (updateError) {
          console.error('Stripe-Webhook: Failed to update organization on subscription create/update', { organizationId, updateError });
          return new Response(JSON.stringify({ received: true, error: 'Database update failed' }), { status: 500 });
        }

        console.log('Stripe-Webhook: Subscription created/updated processed successfully', { organizationId, subscriptionId: subscription.id, status: subscription.status });
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedCustomerId = deletedSubscription.customer as string;

        // Retrieve the customer to get the organization ID from metadata
        const deletedStripeCustomer = await stripe.customers.retrieve(deletedCustomerId);
        const deletedOrganizationId = deletedStripeCustomer.metadata.organizationId;

        if (!deletedOrganizationId) {
          console.error('Stripe-Webhook: Deleted customer metadata missing organizationId', { customerId: deletedCustomerId });
          return new Response(JSON.stringify({ received: true, error: 'Deleted customer metadata missing organizationId' }), { status: 400 });
        }

        // Update the organization status to inactive and reset member limit
        const { error: deleteError } = await supabaseAdmin
          .from('organizations')
          .update({
            subscription_status: 'inactive',
            subscription_tier: 'free', // Revert to free tier
            member_limit: 5, // Revert to free tier limit
            updated_at: new Date().toISOString(), // Update updated_at timestamp
          })
          .eq('id', deletedOrganizationId);

        if (deleteError) {
          console.error('Stripe-Webhook: Failed to update organization on subscription delete', { organizationId: deletedOrganizationId, deleteError });
          return new Response(JSON.stringify({ received: true, error: 'Database update failed' }), { status: 500 });
        }

        console.log('Stripe-Webhook: Subscription deleted processed successfully', { organizationId: deletedOrganizationId, subscriptionId: deletedSubscription.id });
        break;

      // Handle other event types as needed
      default:
        console.warn(`Stripe-Webhook: Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error: unknown) {
    console.error('Stripe-Webhook: Unexpected error processing event', { error });
    return new Response(
      JSON.stringify({
        received: true,
        error: {
          message: 'Internal server error processing event',
          details: error instanceof Error ? error.message : 'An unknown error occurred'
        }
      }),
      {
        status: 500
      }
    );
  }
});