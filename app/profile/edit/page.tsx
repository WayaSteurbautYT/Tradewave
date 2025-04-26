'use client';

import { useAuth } from '@/contexts/AuthContext'; 
import { updateUserProfile, UserProfile } from '@/lib/firestoreService'; 
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"; 
import { Label } from "@/components/ui/label"; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

type EditableProfileFields = Pick<
    UserProfile,
    'displayName' | 'username' | 'bio' | 'location' | 'website' | 'github' | 'twitter' | 'linkedin' | 'instagram' | 'youtube'
>;

export default function EditProfilePage() {
    const { user, userProfile, loading: authLoading, updateProfile } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
    const [bio, setBio] = useState(userProfile?.bio || '');
    const [location, setLocation] = useState(userProfile?.location || '');
    const [website, setWebsite] = useState(userProfile?.website || '');
    const [twitter, setTwitter] = useState(userProfile?.twitter || '');
    const [instagram, setInstagram] = useState(userProfile?.instagram || '');
    const [youtube, setYoutube] = useState(userProfile?.youtube || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/signin');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (userProfile) {
            setDisplayName(userProfile.displayName || '');
            setBio(userProfile.bio || '');
            setLocation(userProfile.location || '');
            setWebsite(userProfile.website || '');
            setTwitter(userProfile.twitter || '');
            setInstagram(userProfile.instagram || '');
            setYoutube(userProfile.youtube || '');
        }
    }, [userProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!displayName) {
            setError('Display name is required.');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await updateProfile({
                displayName,
                bio,
                location,
                website,
                twitter,
                instagram,
                youtube
            });
            setSuccess(true);
            setIsSaving(false);
            setTimeout(() => {
                router.push('/profile/overview');
            }, 2000);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Skeleton className="h-8 w-1/3 mb-4" />
                {[...Array(7)].map((_, i) => ( 
                     <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                ))}
                 <Skeleton className="h-10 w-24 mt-4" />
                 <Skeleton className="h-10 w-32 mt-2" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
                    <CardDescription className="text-center">Update your personal information and social links.</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center text-green-600 p-4 bg-green-50 rounded-lg mb-4">
                            Profile updated successfully! Redirecting...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name or username"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="City, Country"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium pt-2">Social Links</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        value={twitter}
                                        onChange={(e) => setTwitter(e.target.value)}
                                        placeholder="https://twitter.com/yourhandle"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                        placeholder="https://instagram.com/yourhandle"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="youtube">YouTube</Label>
                                    <Input
                                        id="youtube"
                                        value={youtube}
                                        onChange={(e) => setYoutube(e.target.value)}
                                        placeholder="https://youtube.com/@yourchannel"
                                    />
                                </div>
                            </div>

                            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                        </form>
                    )}
                </CardContent>
                {!success && (
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isSaving} onClick={handleSubmit}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}