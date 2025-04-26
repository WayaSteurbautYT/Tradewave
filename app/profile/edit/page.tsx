'use client';

import { useAuth } from '@/contexts/AuthContext'; 
import { updateUserProfile, UserProfile } from '@/lib/firestoreService'; 
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"; 
import { Label } from "@/components/ui/label"; 

type EditableProfileFields = Pick<
    UserProfile,
    'displayName' | 'username' | 'bio' | 'location' | 'website' | 'github' | 'twitter' | 'linkedin'
>;

export default function EditProfilePage() {
    const { user, userProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState<EditableProfileFields>({
        displayName: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        github: '',
        twitter: '',
        linkedin: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                displayName: userProfile.displayName ?? '',
                username: userProfile.username ?? '', 
                bio: userProfile.bio ?? '',
                location: userProfile.location ?? '',
                website: userProfile.website ?? '',
                github: userProfile.github ?? '',
                twitter: userProfile.twitter ?? '',
                linkedin: userProfile.linkedin ?? '',
            });
        }
    }, [userProfile]); 

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: FormEvent) => {
         e.preventDefault(); 
        if (!user) {
             setErrorMessage("User not authenticated.");
             return;
        }

        setIsSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const profileUpdates: Partial<UserProfile> = { ...formData };
            await updateUserProfile(user.uid, profileUpdates);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => {
                setSuccessMessage(null);
                // router.push('/profile/overview'); 
            }, 3000);
        } catch (err) {
            console.error("Error updating profile:", err);
            setErrorMessage("Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="max-w-xl mx-auto p-8 space-y-6">
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

     if (!user) {
         return <p className="p-8 text-center">Please sign in to edit your profile.</p>;
     }

    return (
        <div className="max-w-xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSave} className="space-y-6">
                 <div className="space-y-2">
                     <Label htmlFor="displayName">Display Name</Label>
                     <Input id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Your Name" disabled={isSaving} />
                 </div>

                 <div className="space-y-2">
                     <Label htmlFor="bio">Bio</Label>
                     <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself" disabled={isSaving} rows={4}/>
                 </div>

                 <div className="space-y-2">
                     <Label htmlFor="location">Location</Label>
                     <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" disabled={isSaving}/>
                 </div>

                  <div className="space-y-2">
                     <Label htmlFor="website">Website</Label>
                     <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" disabled={isSaving}/>
                 </div>

                  <h3 className="text-lg font-semibold pt-4 border-t mt-6">Social Links</h3>
                  <div className="space-y-2">
                     <Label htmlFor="github">GitHub</Label>
                     <Input id="github" name="github" value={formData.github} onChange={handleChange} placeholder="github-username" disabled={isSaving}/>
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor="twitter">Twitter / X</Label>
                     <Input id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="twitter-handle" disabled={isSaving}/>
                 </div>
                  <div className="space-y-2">
                     <Label htmlFor="linkedin">LinkedIn</Label>
                     <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="linkedin-profile-name" disabled={isSaving}/>
                 </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/profile/overview')}>
                        Cancel
                    </Button>
                     <div className="mt-4 text-sm w-full sm:w-auto sm:ml-auto text-center sm:text-left">
                         {successMessage && <p className="text-green-600 font-medium">{successMessage}</p>}
                         {errorMessage && <p className="text-red-600 font-medium">{errorMessage}</p>}
                     </div>
                </div>

            </form>
        </div>
    );
}