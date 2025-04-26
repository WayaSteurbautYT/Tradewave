'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function SubscribePage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (!loading && userProfile && userProfile.role === 'seller') {
      router.push('/dashboard/seller');
    } else if (!loading && userProfile && userProfile.subscriptionActive) {
      router.push('/dashboard/buyer');
    }
  }, [user, userProfile, loading, router]);

  const handleSubscribe = async () => {
    if (!user || !userProfile) {
      setError('You must be logged in to subscribe.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: userProfile.stripeCustomerId || '',
          email: user.email || '',
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout for subscription
      } else {
        throw new Error(data.error || 'Failed to initiate subscription checkout.');
      }
    } catch (err: any) {
      console.error('Error initiating subscription checkout:', err);
      setError(err.message || 'An error occurred during subscription checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Subscribe to TradeWave Premium</CardTitle>
          <CardDescription className="text-center pt-2">
            Unlock exclusive content and features with our Premium Viewer Plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">$9.99 <span className="text-base font-normal">/ month</span></p>
            <p className="text-muted-foreground mt-2">Billed monthly. Cancel anytime.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-primary text-xl">✓</div>
              <div>
                <p className="font-medium">Access to Premium Content</p>
                <p className="text-sm text-muted-foreground">Enjoy exclusive videos, music, art, and services from top creators.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-primary text-xl">✓</div>
              <div>
                <p className="font-medium">Ad-Free Experience</p>
                <p className="text-sm text-muted-foreground">Browse and view content without interruptions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-primary text-xl">✓</div>
              <div>
                <p className="font-medium">Priority Support</p>
                <p className="text-sm text-muted-foreground">Get faster responses to your inquiries and issues.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-primary text-xl">✓</div>
              <div>
                <p className="font-medium">Early Access to New Features</p>
                <p className="text-sm text-muted-foreground">Be the first to try out new tools and functionalities on TradeWave.</p>
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-center">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full max-w-xs bg-primary text-white hover:bg-primary/90 text-lg py-3"
          >
            {isProcessing ? 'Processing Subscription...' : 'Start Premium Subscription'}
          </Button>
          <div className="text-xs text-muted-foreground text-center max-w-md">
            By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will automatically renew each month until cancelled.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
