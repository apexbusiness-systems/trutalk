import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as const,
});

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  customerId?: string
): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      metadata: {
        platform: 'trutalk',
      },
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw new Error('Failed to create payment intent');
  }
}

export async function createCustomer(email: string, phoneNumber: string): Promise<Stripe.Customer> {
  try {
    return await stripe.customers.create({
      email,
      phone: phoneNumber,
      metadata: {
        platform: 'trutalk',
      },
    });
  } catch (error) {
    console.error('Stripe customer creation error:', error);
    throw new Error('Failed to create customer');
  }
}

export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: {
        platform: 'trutalk',
      },
    });
  } catch (error) {
    console.error('Stripe subscription error:', error);
    throw new Error('Failed to create subscription');
  }
}
