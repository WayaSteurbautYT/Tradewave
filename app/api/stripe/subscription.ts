import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil', // Using the exact version expected by type definitions
});

export async function POST(req: Request) {
  // Check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Stripe API key is not set.' }, { status: 500 });
  }
  
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error('NEXT_PUBLIC_BASE_URL is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: Base URL is not set.' }, { status: 500 });
  }

  try {
    const { customerId, email } = await req.json();

    // Create or use existing customer
    let customer;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else {
      customer = await stripe.customers.create({
        email: email || `user-${Date.now()}@example.com`,
        description: `Customer for ${email || 'anonymous'}`,
      });
    }

    // Create a Checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'TradeWave Premium Viewer Plan',
              description: 'Monthly subscription for access to premium content and features',
            },
            unit_amount: 999, // $9.99 per month
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/buyer?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?subscription=cancelled`,
      metadata: {
        subscription_type: 'viewer_premium',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating subscription checkout session:', error);
    return NextResponse.json({ error: error.message || 'Failed to create subscription checkout session' }, { status: 500 });
  }
}
