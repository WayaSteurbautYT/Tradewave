import { useAuth } from '@/lib/context/auth-context';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentMethodForm from '../../../components/PaymentMethodForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Payment Method</h2>
      <Elements stripe={stripePromise}>
        <PaymentMethodForm user={user} />
      </Elements>
    </div>
  );
} 