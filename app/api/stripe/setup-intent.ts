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

  try {
    const { email } = await req.json();

    // Create a new customer if not provided
    const customer = await stripe.customers.create({
      email: email || `user-${Date.now()}@example.com`,
      description: `Customer for ${email || 'anonymous'}`,
    });

    // Create a SetupIntent for future payments
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      usage: 'off_session', // Allows saving the payment method for future use
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (error: any) {
    console.error('Error creating SetupIntent:', error);
    return NextResponse.json({ error: error.message || 'Failed to create SetupIntent' }, { status: 500 });
  }
}
