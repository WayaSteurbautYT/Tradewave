import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid, email } = req.body;
  if (!uid || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // First find or create customer
    let customer = await stripe.customers.list({ email });
    if (customer.data.length === 0) {
      customer = await stripe.customers.create({
        email,
        metadata: { uid }
      });
    } else {
      customer = customer.data[0];
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      metadata: { uid, email },
    });

    return res.status(200).json({ 
      clientSecret: setupIntent.client_secret,
      customerId: customer.id 
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}