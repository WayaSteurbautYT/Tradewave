import { useAuth } from '@/lib/context/auth-context';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    await setDoc(doc(db, 'profiles', user.uid), profile, { merge: true });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };
  return (
    <div className="max-w-xl mx-auto p-8 space-y-4">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Edit Profile</h2>
      <Input name="name" value={profile.name || ''} onChange={handleChange} placeholder="Name" />
      <Input name="username" value={profile.username || ''} onChange={handleChange} placeholder="Username" />
      <Textarea name="bio" value={profile.bio || ''} onChange={handleChange} placeholder="Bio" />
      <Input name="location" value={profile.location || ''} onChange={handleChange} placeholder="Location" />
      <Input name="website" value={profile.website || ''} onChange={handleChange} placeholder="Website" />
      <Input name="github" value={profile.github || ''} onChange={handleChange} placeholder="GitHub" />
      <Input name="twitter" value={profile.twitter || ''} onChange={handleChange} placeholder="Twitter" />
      <Input name="linkedin" value={profile.linkedin || ''} onChange={handleChange} placeholder="LinkedIn" />
      <Button onClick={handleSave} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white mt-4">
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
      {success && <div className="text-green-500 mt-2">Profile updated!</div>}
      <Button variant="outline" className="mt-2" onClick={() => router.push('/profile/overview')}>Back to Overview</Button>
    </div>
  );
} 