'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, sendEmailVerification as firebaseSendEmailVerification, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming auth is exported from firebase.ts
import { upsertUser, getUserProfile, updateUserProfile, UserProfile, updateUserStripeCustomerId } from '@/lib/firestoreService'; // Import Firestore functions

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null; // Store Firestore profile data
    loading: boolean;
    logout: () => Promise<void>;
    emailVerified: boolean;
    sendEmailVerification: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    ensureStripeCustomer: () => Promise<string | null>;
    // Add Discord/YouTube sign-in as needed
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    logout: async () => {},
    emailVerified: false,
    sendEmailVerification: async () => {},
    refreshProfile: async () => {},
    updateProfile: async () => {},
    signInWithGoogle: async () => {},
    signInWithEmail: async () => {},
    signUpWithEmail: async () => {},
    ensureStripeCustomer: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true); // Start loading whenever auth state might change
            if (firebaseUser) {
                console.log("Auth state changed: User logged in", firebaseUser.uid);
                setUser(firebaseUser);
                // Ensure user exists in Firestore and get profile
                try {
                     // Upsert first to create or update basic info
                    await upsertUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                    });

                    // Then fetch the potentially updated/complete profile
                    const fullProfile = await getUserProfile(firebaseUser.uid);
                    setUserProfile(fullProfile); // Set the fetched profile
                    console.log("User profile loaded:", fullProfile);

                } catch (error) {
                    console.error("Error during user upsert or profile fetch:", error);
                    setUserProfile(null); // Clear profile on error
                     // Optionally sign out the user if profile sync fails critically
                    // await firebaseSignOut(auth);
                    // setUser(null); // Handled by onAuthStateChanged after signout
                }
            } else {
                console.log("Auth state changed: User logged out");
                setUser(null);
                setUserProfile(null); // Clear profile on logout
            }
            setLoading(false); // Finish loading after processing
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this runs only once on mount

    const logout = async () => {
        setLoading(true); // Indicate loading state during logout process
        try {
            await firebaseSignOut(auth);
            // State updates (user, userProfile to null) are handled by onAuthStateChanged
            console.log("User signed out successfully via logout function.");
        } catch (error) {
            console.error("Error signing out: ", error);
             // Reset loading state even if logout fails, auth state might remain unchanged
             // onAuthStateChanged might not fire if sign out fails, so reset here.
            setLoading(false);
        }
         // setLoading(false) is called within onAuthStateChanged when user becomes null
    };

    // Send verification email to current user
    const sendEmailVerification = async () => {
        if (auth.currentUser && !auth.currentUser.emailVerified) {
            await firebaseSendEmailVerification(auth.currentUser);
            console.log('Verification email sent');
        }
    };

    const refreshProfile = async () => {
        if (user?.uid) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
        }
    };

    const updateProfile = async (profileData: Partial<UserProfile>) => {
        if (user) {
            await updateUserProfile(user.uid, profileData);
            // Refresh user profile data
            const updatedProfile = await getUserProfile(user.uid);
            setUserProfile(updatedProfile);
        }
    };

    // Google sign-in
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    // Email/password sign-in
    const signInWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Email/password sign-up
    const signUpWithEmail = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    // Ensure Stripe customer exists for the user
    const ensureStripeCustomer = async (): Promise<string | null> => {
        if (!user) return null;
        if (userProfile?.stripeCustomerId) return userProfile.stripeCustomerId;
        // Call your API to create a Stripe customer
        const response = await fetch('/api/stripe/setup-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
        });
        if (!response.ok) return null;
        const { customerId } = await response.json();
        if (customerId) {
            await updateUserStripeCustomerId(user.uid, customerId);
            await refreshProfile();
            return customerId;
        }
        return null;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userProfile,
                loading,
                logout,
                emailVerified: user?.emailVerified ?? false,
                sendEmailVerification,
                refreshProfile,
                updateProfile,
                signInWithGoogle,
                signInWithEmail,
                signUpWithEmail,
                ensureStripeCustomer,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
