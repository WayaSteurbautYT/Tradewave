// app/select-role/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RoleSelector from '@/components/RoleSelector'; // Import the component we just created

export default function SelectRolePage() {
    const { user, userProfile, loading, refreshProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only perform actions once loading is complete
        if (!loading) {
            if (!user) {
                // Not logged in, redirect to sign-in
                console.log("SelectRolePage: No user found, redirecting to signin.");
                router.replace('/signin'); // Use replace to avoid adding to history stack
            } else if (userProfile?.role) {
                // Logged in and role already selected, redirect to profile
                 console.log(`SelectRolePage: User has role '${userProfile.role}', redirecting to overview.`);
                router.replace('/profile/overview');
            }
            // If user is logged in but no role, stay on this page to show RoleSelector
             else if (user && !userProfile?.role) {
                 console.log("SelectRolePage: User logged in, no role found. Showing selector.");
             }
        }
    }, [user, userProfile, loading, router]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {/* // TODO: Replace with a proper spinner component */}
                <p>Loading user information...</p>
            </div>
        );
    }

    // If user exists but no role is assigned yet, render the selector.
    // The useEffect handles the redirect cases for !user or userProfile.role exists.
    if (user && !userProfile?.role) {
        return (
             <div className="container mx-auto px-4 py-8">
                <RoleSelector onSuccess={async () => {
                    await refreshProfile();
                    router.push('/payment-setup');
                }} />
             </div>
        );
    }

    // Render a generic loading/checking state while useEffect determines the final state/redirect.
    // This covers the brief moment between loading completing and the redirect/render logic firing.
    return (
         <div className="flex items-center justify-center min-h-screen">
             {/* // TODO: Replace with a proper spinner component */}
             <p>Checking your profile status...</p>
         </div>
    );
}
