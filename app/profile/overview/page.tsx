import { useAuth } from '@/lib/context/auth-context';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function ProfileOverviewPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const userRef = doc(db, 'profiles', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setProfile(userSnap.data());
    }
    fetchProfile();
  }, [user]);
  if (!profile) return <div className="p-8">Loading...</div>;
  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg?height=96&width=96" />
          <AvatarFallback className="text-2xl bg-teal-900 text-teal-300">
            {profile.name?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-teal-300">{profile.name}</h2>
        <p className="text-teal-500">@{profile.username}</p>
        <p className="text-teal-400 text-center">{profile.bio}</p>
        <div className="flex gap-2 text-teal-400">
          <span>{profile.location}</span>
          <span>|</span>
          <a href={profile.website} className="hover:underline" target="_blank" rel="noopener noreferrer">{profile.website}</a>
        </div>
        <Button asChild className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>
      </div>
    </div>
  );
} 