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
    // Optionally, you can attach the SetupIntent to a Stripe Customer
    // For now, just create a SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      metadata: { uid, email },
    });
    return res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
} 