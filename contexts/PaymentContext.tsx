import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PaymentContextType {
  createSetupIntent: () => Promise<string | null>;
  addPaymentMethod: (paymentMethodId: string) => Promise<void>;
  getPaymentMethods: () => Promise<any[]>;
  loading: boolean;
  error: string | null;
}

const PaymentContext = createContext<PaymentContextType>({
  createSetupIntent: async () => null,
  addPaymentMethod: async () => {},
  getPaymentMethods: async () => [],
  loading: false,
  error: null,
});

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const { user, ensureStripeCustomer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a SetupIntent and return the client secret
  const createSetupIntent = async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      await ensureStripeCustomer();
      const response = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      if (!response.ok) throw new Error('Failed to create setup intent');
      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a payment method to the Stripe customer (expand as needed)
  const addPaymentMethod = async (paymentMethodId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      await ensureStripeCustomer();
      // Implement backend endpoint to attach payment method if needed
      // await fetch('/api/stripe/add-payment-method', ...)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get all payment methods for the Stripe customer (expand as needed)
  const getPaymentMethods = async (): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error('User not authenticated');
      await ensureStripeCustomer();
      // Implement backend endpoint to fetch payment methods if needed
      // const response = await fetch('/api/stripe/payment-methods', ...)
      // return await response.json();
      return [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ createSetupIntent, addPaymentMethod, getPaymentMethods, loading, error }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext); 