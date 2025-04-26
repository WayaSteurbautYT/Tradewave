'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';

export default function VerifyEmailPage() {
  const { user, sendEmailVerification } = useAuth();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    if (user.emailVerified) {
      router.push('/profile/create');
      return;
    }

    // Poll for email verification status every 10 seconds
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        router.push('/profile/create');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsSending(true);
    setMessage(null);
    try {
      await sendEmailVerification();
      setMessage('Verification email sent. Please check your inbox.');
      setCountdown(30); // Disable resend for 30 seconds
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      <p className="mb-4">We’ve sent a verification email to <strong>{user.email}</strong>. Please check your inbox and follow the instructions to verify your email address.</p>
      <p className="mb-4">Once verified, you’ll be automatically redirected. We’re checking every 10 seconds.</p>
      <button
        onClick={handleResendEmail}
        disabled={isSending || countdown > 0}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
      </button>
      {message && <p className={`mt-2 ${message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </div>
  );
}
