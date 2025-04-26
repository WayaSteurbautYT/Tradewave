"use client"
import type { NextApiRequest, NextApiResponse } from "next"
import { buffer } from "micro"
import Stripe from "stripe"
import { earnTokens } from "@/lib/token"

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed")
  }

  const sig = req.headers["stripe-signature"] as string
  const buf = await buffer(req)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret!)
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const uid = session.metadata?.uid
    const tokens = parseInt(session.metadata?.tokens || "0", 10)
    if (uid && tokens > 0) {
      await earnTokens(uid, tokens, "Stripe purchase")
    }
  }

  res.status(200).json({ received: true })
} 