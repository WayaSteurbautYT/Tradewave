import { useAuth } from '@/lib/context/auth-context';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendEmailVerification } from 'firebase/auth';

export default function VerificationPage() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  useEffect(() => {
    if (user) setVerified(user.emailVerified);
  }, [user]);
  const handleResend = async () => {
    if (user) {
      await sendEmailVerification(user);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Email Verification</h2>
      {verified ? (
        <div className="text-green-500 mb-4">Your email is verified. You can now access all features.</div>
      ) : (
        <>
          <div className="text-yellow-500 mb-4">Please verify your email to access all features.</div>
          <Button onClick={handleResend} className="bg-teal-600 hover:bg-teal-700 text-white">Resend Verification Email</Button>
          {sent && <div className="text-green-500 mt-2">Verification email sent!</div>}
        </>
      )}
    </div>
  );
} 