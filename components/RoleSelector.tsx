// components/RoleSelector.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserRole } from '@/lib/firestoreService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define available roles based on PLANNING.md Target Audience
const ROLES = [
    { id: 'buyer', name: 'Buyer', description: 'Looking to purchase content or hire talent.' },
    { id: 'fan', name: 'Fan', description: 'Supporting creators and enjoying content.' },
    { id: 'freelancer', name: 'Freelancer', description: 'Offering services for hire.' },
    { id: 'artist', name: 'Artist', description: 'Creating visual or audio art.' },
    { id: 'developer', name: 'Developer', description: 'Building software or tools.' },
    { id: 'creator', name: 'Content Creator', description: 'Producing videos, streams, or other media.' },
];

interface RoleSelectorProps {
    onRoleSelected?: (selectedRole: string) => void; // Optional callback after successful role selection
    onSuccess?: () => Promise<void>;
}

export default function RoleSelector({ onRoleSelected, onSuccess }: RoleSelectorProps) {
    const { user, userProfile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRoleSelection = async () => {
        if (!user || !selectedRole) {
            setError("Please select a role.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await updateUserRole(user.uid, selectedRole);
            if (onSuccess) {
                await onSuccess();
            } else {
                console.log(`Role '${selectedRole}' selected for user ${user.uid}`);
            }
            // TODO: Ideally, AuthContext should refetch/update userProfile after role change
            // For now, we proceed assuming the role is set.
            if (onRoleSelected) {
                onRoleSelected(selectedRole);
            } else {
                // Default behavior if no callback: redirect to profile overview
                router.push('/profile/overview');
            }
        } catch (err) {
            console.error("Error updating role:", err);
            setError("Failed to update role. Please try again.");
            setIsLoading(false); // Only set loading false on error if staying on page
        }
         // On success, navigation likely happens, so no need to reset loading state here
    };

    // Handle edge cases
    if (authLoading) {
        return <p className="text-center p-4">Loading user data...</p>;
    }
    if (!user) {
        // This component should ideally be rendered within a protected route/context
        // If somehow rendered without a user, redirect.
        router.push('/signin');
        return null;
    }
     // Although AuthContext fetches profile, it might not be instant.
     // Check userProfile state from context AFTER authLoading is false.
    // if (userProfile?.role) {
         // If the parent component decides based on role, it might not render this component at all.
         // If it *is* rendered despite having a role, let's prevent interaction.
         // console.log("User already has a role:", userProfile.role);
         // return <p>Your role is already set to: {userProfile.role}</p>;
     //}


    return (
        <Card className="w-full max-w-lg mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-2xl">Select Your Primary Role</CardTitle>
                <CardDescription>Choose the role that best describes how you'll use TradeWave. You can explore other features later.</CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="mb-4 text-sm text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{error}</p>}
                <RadioGroup
                    value={selectedRole ?? ''}
                    onValueChange={setSelectedRole}
                    disabled={isLoading}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4" // Responsive grid
                >
                    {ROLES.map((role) => (
                        <Label
                            key={role.id}
                            htmlFor={role.id}
                            className={`flex flex-col justify-between space-y-1 border p-4 rounded-lg cursor-pointer transition-all duration-150 h-full ${ // Added h-full
                                selectedRole === role.id
                                ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/10'
                                : 'border-input hover:border-primary/50'
                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                             <div className="flex items-center space-x-3 mb-1">
                                <RadioGroupItem value={role.id} id={role.id} />
                                <span className="font-semibold text-base">{role.name}</span>
                            </div>
                            <span className="pl-8 text-sm text-muted-foreground">{role.description}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleRoleSelection}
                    disabled={!selectedRole || isLoading}
                    className="w-full"
                    size="lg" // Make button prominent
                >
                    {isLoading ? "Saving..." : "Confirm and Continue"}
                </Button>
            </CardFooter>
        </Card>
    );
}
