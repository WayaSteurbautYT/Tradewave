import { useAuth } from '@/lib/context/auth-context';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function StatsPage() {
  const { user } = useAuth();
  const [tokens, setTokens] = useState(0);
  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      const userRef = doc(db, 'profiles', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().tokens) {
        setTokens(userSnap.data().tokens);
      }
    }
    fetchStats();
  }, [user]);
  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Stats</h2>
      <div className="mb-4">
        <span className="text-lg text-teal-400">Token Balance: </span>
        <span className="text-2xl font-bold text-teal-200">{tokens}</span>
      </div>
      <div className="mb-4">Performance stats coming soon.</div>
      <div>Earnings stats coming soon.</div>
    </div>
  );
} 