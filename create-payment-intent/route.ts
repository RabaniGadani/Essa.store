import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// ✅ Ensure the secret key is defined
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}

// ✅ Initialize Stripe
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
});

// ✅ POST handler
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const amount = body.amount;

    // ✅ Validate the amount
    if (
      amount === undefined ||
      typeof amount !== 'number' ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        { error: 'Amount must be a valid positive number.' },
        { status: 400 }
      );
    }

    // ✅ Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: 'pkr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // ✅ Return the client secret to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('[Stripe Error]', error);

    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
