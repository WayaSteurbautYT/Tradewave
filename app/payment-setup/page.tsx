'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserStripeCustomerId } from '@/lib/firestoreService';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function PaymentSetupPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check for Stripe publishable key
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables.');
    setError('Client configuration error: Stripe publishable key is not set.');
  }

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    if (userProfile?.stripeCustomerId) {
      router.push(userProfile?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer');
      return;
    }

    // Fetch client secret for SetupIntent
    fetch('/api/stripe/setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to load payment setup');
        }
      })
      .catch((err) => setError(err.message));
  }, [user, userProfile, router]);

  if (!clientSecret && !error) {
    return <div>Loading payment setup...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Setup Payment Method</h1>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentSetupForm />
      </Elements>
    </div>
  );
}

function PaymentSetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSetupComplete = async (setupIntent: any) => {
    console.log('Payment method setup successful:', setupIntent);
    if (user) {
      if (setupIntent.customer && typeof setupIntent.customer === 'string') {
        await updateUserStripeCustomerId(user.uid, setupIntent.customer);
      } else {
        console.error('No customer ID found in setupIntent');
        setErrorMessage('Payment setup failed: No customer ID returned.');
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setTimeout(() => {
        router.push(userProfile?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer');
      }, 2000);
    } else {
      console.error('User not found after payment setup');
      setErrorMessage('User not authenticated. Please sign in again.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !user) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/verify-email`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred during payment setup');
        setIsSubmitting(false);
        return;
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        handleSetupComplete(setupIntent);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Processing...' : 'Save Payment Method'}
      </button>
      {errorMessage && <div className="mt-2 text-red-600">{errorMessage}</div>}
    </form>
  );
}
