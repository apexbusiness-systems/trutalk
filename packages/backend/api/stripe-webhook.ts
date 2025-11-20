import { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../src/lib/stripe';
import { supabase } from '../src/lib/supabase';
import Stripe from 'stripe';

/**
 * Stripe Webhook Endpoint
 *
 * POST /api/stripe-webhook
 * Receives webhooks from Stripe about payment events
 *
 * Events: payment_intent.succeeded, customer.subscription.created, etc.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  console.log('Stripe webhook received:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.user_id;
  const productType = paymentIntent.metadata.product_type; // 'echo_chips', 'subscription'
  const amount = paymentIntent.amount / 100; // Convert from cents

  if (!userId) {
    console.error('No user_id in payment metadata');
    return;
  }

  // Determine Echo Chips amount based on payment
  let chipsAmount = 0;

  switch (productType) {
    case 'echo_chips_small':
      chipsAmount = 50;
      break;
    case 'echo_chips_medium':
      chipsAmount = 150;
      break;
    case 'echo_chips_large':
      chipsAmount = 500;
      break;
    case 'echo_chips_mega':
      chipsAmount = 1500;
      break;
    default:
      chipsAmount = Math.floor(amount * 50); // Default: $1 = 50 chips
  }

  // Update user's Echo Chips
  const { data: user } = await supabase
    .from('users')
    .select('echo_chips')
    .eq('id', userId)
    .single();

  if (user) {
    await supabase
      .from('users')
      .update({
        echo_chips: (user.echo_chips || 0) + chipsAmount,
      })
      .eq('id', userId);
  }

  // Record transaction
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'purchase',
    amount: chipsAmount,
    price_usd: amount,
    stripe_payment_intent_id: paymentIntent.id,
    stripe_customer_id: paymentIntent.customer as string,
    description: `Purchased ${chipsAmount} Echo Chips`,
    metadata: {
      product_type: productType,
    },
  });

  // Log analytics
  await supabase.from('analytics_events').insert({
    user_id: userId,
    event_name: 'purchase_completed',
    event_properties: {
      product_type: productType,
      chips_amount: chipsAmount,
      price_usd: amount,
    },
  });

  console.log(`Payment succeeded: ${userId} purchased ${chipsAmount} chips for $${amount}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.user_id;

  if (userId) {
    await supabase.from('analytics_events').insert({
      user_id: userId,
      event_name: 'purchase_failed',
      event_properties: {
        payment_intent_id: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
      },
    });
  }

  console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  const tier = subscription.metadata.tier || 'premium'; // 'premium' or 'vip'
  const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

  // Update user subscription
  await supabase
    .from('users')
    .update({
      subscription_tier: tier,
      subscription_expires_at: expiresAt,
    })
    .eq('id', userId);

  // Log analytics
  await supabase.from('analytics_events').insert({
    user_id: userId,
    event_name: 'subscription_updated',
    event_properties: {
      tier,
      expires_at: expiresAt,
      subscription_id: subscription.id,
    },
  });

  console.log(`Subscription updated: ${userId} - ${tier} until ${expiresAt}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  // Downgrade to free tier
  await supabase
    .from('users')
    .update({
      subscription_tier: 'free',
      subscription_expires_at: null,
    })
    .eq('id', userId);

  // Log analytics
  await supabase.from('analytics_events').insert({
    user_id: userId,
    event_name: 'subscription_cancelled',
    event_properties: {
      subscription_id: subscription.id,
    },
  });

  console.log(`Subscription cancelled: ${userId}`);
}
