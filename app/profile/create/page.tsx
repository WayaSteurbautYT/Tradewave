'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/firestoreService';

export default function CreateProfilePage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [website, setWebsite] = useState(userProfile?.website || '');
  const [twitter, setTwitter] = useState(userProfile?.twitter || '');
  const [github, setGithub] = useState(userProfile?.github || '');
  const [linkedin, setLinkedin] = useState(userProfile?.linkedin || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
    if (!user.emailVerified) {
      router.push('/verify-email');
      return;
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateUserProfile(user.uid, {
        bio,
        location,
        website,
        twitter,
        github,
        linkedin,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating your profile');
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Where are you based?"
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Your personal website"
          />
        </div>
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium mb-1">Twitter</label>
          <input
            id="twitter"
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Twitter handle"
          />
        </div>
        <div>
          <label htmlFor="github" className="block text-sm font-medium mb-1">GitHub</label>
          <input
            id="github"
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="GitHub username"
          />
        </div>
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium mb-1">LinkedIn</label>
          <input
            id="linkedin"
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="LinkedIn profile URL"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Creating Profile...' : 'Create Profile & Continue'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}
