import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil', // Using the exact version expected by type definitions
});

// Token packages available for purchase
const tokenPackages = {
  small: { name: 'Small Token Pack', tokens: 100, price: 1000 }, // $10.00
  medium: { name: 'Medium Token Pack', tokens: 500, price: 4500 }, // $45.00
  large: { name: 'Large Token Pack', tokens: 1200, price: 10000 }, // $100.00
};

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
    const { packageId, customerId, email } = await req.json();

    // Validate package selection
    if (!packageId || !tokenPackages[packageId as keyof typeof tokenPackages]) {
      return NextResponse.json({ error: 'Invalid package selection' }, { status: 400 });
    }

    const selectedPackage = tokenPackages[packageId as keyof typeof tokenPackages];

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

    // Create a Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPackage.name,
              description: `Purchase of ${selectedPackage.tokens} WaveTokens`,
            },
            unit_amount: selectedPackage.price, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/buy-tokens?payment=cancelled`,
      metadata: {
        token_count: selectedPackage.tokens.toString(),
        package_id: packageId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
  }
}
