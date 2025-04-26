'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WithdrawPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const tokenToDollarRate = 0.05; // 1 Token = $0.05

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (!loading && userProfile && userProfile.role !== 'seller') {
      router.push(userProfile.role === 'buyer' ? '/dashboard/buyer' : '/select-role');
    } else if (!loading && userProfile) {
      setEmail(userProfile.email || '');
    }
  }, [user, userProfile, loading, router]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !paymentMethod || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount to withdraw.');
      return;
    }

    if (userProfile && withdrawAmount > (userProfile.tokens || 0)) {
      setError('Insufficient token balance for this withdrawal.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate API call to process withdrawal
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would typically call an API endpoint to process the withdrawal,
      // update the user's token balance in Firestore, and initiate the payout
      console.log('Processing withdrawal:', { amount: withdrawAmount, paymentMethod, email });

      setSuccess(true);
      setIsProcessing(false);
      setAmount('');

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/dashboard/seller');
      }, 3000);
    } catch (err: any) {
      console.error('Error processing withdrawal:', err);
      setError(err.message || 'An error occurred while processing your withdrawal. Please try again.');
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
          <CardTitle className="text-2xl font-bold text-center">Withdraw Earnings</CardTitle>
          <CardDescription className="text-center">Convert your tokens to money and withdraw to your preferred payment method.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userProfile && (
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Available Token Balance</p>
              <p className="text-2xl font-bold text-yellow-400">{userProfile.tokens || 0} Tokens</p>
              <p className="text-sm text-muted-foreground">≈ ${(userProfile.tokens || 0) * tokenToDollarRate} USD</p>
            </div>
          )}

          {success ? (
            <div className="text-center text-green-600 p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-medium">Withdrawal successful!</p>
              <p className="text-sm mt-1">Your request to withdraw {amount} tokens has been processed. Funds will be transferred to your account shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Withdraw (Tokens)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter token amount"
                  min="10"
                  step="1"
                  required
                />
                {amount && !isNaN(parseFloat(amount)) && (
                  <p className="text-xs text-muted-foreground">≈ ${(parseFloat(amount) * tokenToDollarRate).toFixed(2)} USD</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('paypal')}
                    type="button"
                    className={paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : ''}
                  >
                    PayPal
                  </Button>
                  <Button
                    variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('bank')}
                    type="button"
                    className={paymentMethod === 'bank' ? 'bg-blue-600 text-white' : ''}
                  >
                    Bank Transfer
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{paymentMethod === 'paypal' ? 'PayPal Email' : 'Account Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={paymentMethod === 'paypal' ? 'Enter your PayPal email' : 'Enter email associated with bank account'}
                  required
                />
              </div>

              {error && <div className="text-red-600 text-sm text-center">{error}</div>}

              <div className="text-xs text-muted-foreground text-center pt-2">
                Withdrawals are processed within 3-5 business days. A processing fee may apply. Minimum withdrawal is 10 tokens.
              </div>
            </form>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing}
              onClick={handleWithdraw}
            >
              {isProcessing ? 'Processing Withdrawal...' : 'Withdraw Tokens'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
