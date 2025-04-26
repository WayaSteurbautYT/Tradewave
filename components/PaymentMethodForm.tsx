import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';

interface PaymentMethodFormProps {
  user: any;
  onSuccess?: () => void;
  onCustomerCreated?: (customerId: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#14b8a6',
      fontFamily: 'inherit',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#64748b',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ user, onSuccess, onCustomerCreated }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientSecret() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const clientSecret = await createSetupIntent();
        if (clientSecret) {
          setClientSecret(clientSecret);
        }
      } catch (err: any) {
        setError('Failed to connect to payment server.');
      } finally {
        setLoading(false);
      }
    }
    fetchClientSecret();
  }, [user]);

  const createSetupIntent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }
      
      const { clientSecret, customerId } = await response.json();
      setCustomerId(customerId);
      onCustomerCreated?.(customerId);
      return clientSecret;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    const { setupIntent, error } = await stripe.confirmCardSetup(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user?.email || undefined,
          },
        },
      }
    );
    if (error) {
      setError(error.message || 'Failed to save card.');
      setLoading(false);
      return;
    }
    // Optionally, send setupIntent.payment_method to your backend to save
    setSuccess(true);
    onSuccess?.();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement options={CARD_ELEMENT_OPTIONS} className="p-3 bg-teal-900/30 rounded border border-teal-800" />
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      {success && <div className="text-green-500 text-sm">Card saved successfully!</div>}
      <Button type="submit" disabled={!stripe || loading || !clientSecret} className="bg-teal-600 hover:bg-teal-700 text-white">
        {loading ? 'Saving...' : 'Save Card'}
      </Button>
    </form>
  );
};

export default PaymentMethodForm; 