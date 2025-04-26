import { useAuth } from '@/lib/context/auth-context';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Award, ShieldCheck, UploadCloud } from 'lucide-react';

export default function BadgesPage() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  useEffect(() => {
    async function fetchBadges() {
      if (!user) return;
      const userRef = doc(db, 'profiles', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().badges) {
        setBadges(userSnap.data().badges);
      } else {
        setBadges([
          { id: 'early', name: 'Early Adopter', icon: Award, description: 'Joined TradeWave in the first month.' },
          { id: 'pro', name: 'Pro User', icon: ShieldCheck, description: 'Upgraded to Pro.' },
          { id: 'uploader', name: 'Uploader', icon: UploadCloud, description: 'Uploaded your first project.' },
        ]);
      }
    }
    fetchBadges();
  }, [user]);
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Badges</h2>
      <div className="flex flex-wrap gap-6">
        {badges.map((badge, idx) => (
          <div key={badge.id || idx} className="flex flex-col items-center group cursor-pointer">
            <span className="rounded-full bg-teal-800 p-4 mb-2">
              {badge.icon ? (
                <badge.icon className="h-8 w-8 text-yellow-400 group-hover:scale-110 transition-transform" />
              ) : (
                <Award className="h-8 w-8 text-yellow-400" />
              )}
            </span>
            <span className="text-teal-200 font-semibold text-sm">{badge.name}</span>
            <span className="text-xs text-teal-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-center w-32">{badge.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 