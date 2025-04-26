import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { tokens, price, uid } = req.body
  if (!tokens || !price || !uid) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tokens} TradeWave Tokens`,
            },
            unit_amount: price * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/dashboard/buy-tokens?success=1&uid=${uid}&tokens=${tokens}`,
      cancel_url: `${req.headers.origin}/dashboard/buy-tokens?canceled=1`,
      metadata: {
        uid,
        tokens,
      },
    })
    return res.status(200).json({ url: session.url })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
} 