import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10"
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, currency } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Payment processing failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}