'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Token packages available for purchase
const tokenPackages = [
  { id: 'small', name: 'Small Pack', tokens: 100, price: 10, description: 'Perfect for trying out TradeWave.' },
  { id: 'medium', name: 'Medium Pack', tokens: 500, price: 45, description: 'A great value for regular users.' },
  { id: 'large', name: 'Large Pack', tokens: 1200, price: 100, description: 'Best value for active creators and buyers.' },
];

export default function BuyTokensPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string>('medium');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handlePurchase = async () => {
    if (!user || !userProfile) {
      setError('You must be logged in to purchase tokens.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const selectedPkg = tokenPackages.find(pkg => pkg.id === selectedPackage);
      if (!selectedPkg) {
        throw new Error('Invalid package selection.');
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage,
          customerId: userProfile.stripeCustomerId || '',
          email: user.email || '',
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error(data.error || 'Failed to initiate checkout.');
      }
    } catch (err: any) {
      console.error('Error initiating checkout:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Buy WaveTokens</CardTitle>
          <CardDescription className="text-center pt-2">
            Purchase tokens to unlock premium content, hire talent, and support creators on TradeWave.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokenPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-primary shadow-md scale-105' : 'border-muted'}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-xl ${selectedPackage === pkg.id ? 'text-primary' : ''}`}>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">{pkg.tokens} <span className="text-yellow-400">Tokens</span></div>
                  <div className="text-center text-muted-foreground">${pkg.price}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full max-w-xs bg-yellow-400 text-blue-900 hover:bg-yellow-500 text-lg py-3"
          >
            {isProcessing ? 'Processing Payment...' : 'Proceed to Payment'}
          </Button>
          <div className="text-xs text-muted-foreground text-center max-w-md">
            By purchasing tokens, you agree to our Terms of Service and understand that tokens are a virtual currency with no cash value and are non-refundable.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
