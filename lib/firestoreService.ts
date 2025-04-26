'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming auth is exported from firebase.ts
import { upsertUser, getUserProfile, updateUserProfile, UserProfile } from '@/lib/firestoreService'; // Import Firestore functions

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null; // Store Firestore profile data
    loading: boolean;
    logout: () => Promise<void>;
    // Add sign-in methods if needed here, or handle them in specific components/pages
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
                    const initialProfileData = await upsertUser({
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


    return (
        <AuthContext.Provider value={{ user, userProfile, loading, logout }}>
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
import { db } from './firebase'; // Assuming db is exported from firebase.ts
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    role?: string | null; // e.g., 'buyer', 'freelancer', 'fan', 'artist', 'developer', 'creator'
    createdAt: any; // Firestore Timestamp
    updatedAt: any; // Firestore Timestamp
    stripeCustomerId?: string | null; // Added for Stripe integration
    // Add editable profile fields
    username?: string | null; // Consider uniqueness implications if allowing edit
    bio?: string | null;
    location?: string | null;
    website?: string | null;
    github?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
}

// Function to create or update user data in Firestore
export const upsertUser = async (user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', user.uid);
    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Create new user document
            const newUserProfile: UserProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: null, // Role not set initially
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            await setDoc(userRef, newUserProfile);
            console.log("New user document created for:", user.uid);
            // Return the newly created profile data (without Timestamps resolved yet)
            // Fetch it again to get resolved timestamps if needed immediately, otherwise this is fine.
             return { ...newUserProfile, createdAt: new Date(), updatedAt: new Date() }; // Approximate timestamp
        } else {
            // User exists, maybe update some fields like displayName or photoURL if they changed
            const existingData = userSnap.data() as UserProfile;
            const updates: Partial<UserProfile> = {};
            if (user.displayName !== existingData.displayName) {
                updates.displayName = user.displayName;
            }
            if (user.photoURL !== existingData.photoURL) {
                updates.photoURL = user.photoURL;
            }
            if (Object.keys(updates).length > 0) {
                 updates.updatedAt = serverTimestamp();
                 await updateDoc(userRef, updates);
                 console.log("User document updated for:", user.uid);
                 return { ...existingData, ...updates, updatedAt: new Date() }; // Return updated data
            }

            console.log("User document already exists and is up-to-date for:", user.uid);
            return existingData; // Return existing data
        }
    } catch (error) {
        console.error("Error in upsertUser:", error);
        throw error; // Re-throw error for handling upstream
    }
};

// Function to get user profile data
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            // Ensure timestamps are converted if needed, though usually handled by Firestore SDK
            return docSnap.data() as UserProfile;
        } else {
            console.warn("No such user document for UID:", uid);
            return null;
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error; // Re-throw error
    }
};

// Function to update user role
export const updateUserRole = async (uid: string, role: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    try {
        await updateDoc(userRef, {
            role: role,
            updatedAt: serverTimestamp()
        });
        console.log("User role updated successfully for:", uid);
    } catch (error) {
        console.error("Error updating user role:", error);
        throw error; // Re-throw error
    }
};

// Function to update Stripe Customer ID
export const updateUserStripeCustomerId = async (uid: string, customerId: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    try {
        await updateDoc(userRef, {
            stripeCustomerId: customerId,
            updatedAt: serverTimestamp()
        });
        console.log("Stripe Customer ID updated successfully for:", uid);
    } catch (error) {
        console.error("Error updating Stripe Customer ID:", error);
        throw error;
    }
};

// New function to update profile details
export const updateUserProfile = async (uid: string, profileData: Partial<UserProfile>): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    // Filter out fields that shouldn't be directly updated here (like uid, email, role, etc.)
    // Define fields that ARE allowed to be updated through this function
    const allowedUpdates: Partial<UserProfile> = {
        displayName: profileData.displayName,
        // username: profileData.username, // Add validation/uniqueness check if enabling username edits
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        github: profileData.github,
        twitter: profileData.twitter,
        linkedin: profileData.linkedin,
        // We should always update the 'updatedAt' timestamp
        updatedAt: serverTimestamp()
    };

    // Remove undefined fields to avoid overwriting with undefined in Firestore
    // or fields that were not present in the input `profileData`
    Object.keys(allowedUpdates).forEach(keyStr => {
        const key = keyStr as keyof Partial<UserProfile>;
        // Keep updatedAt timestamp
        if (key === 'updatedAt') return;
        // Delete if the input didn't provide this key or if it was explicitly undefined
        if (!(key in profileData) || profileData[key] === undefined) {
            delete allowedUpdates[key];
        }
    });

    // Check if there's anything to update besides the timestamp
    if (Object.keys(allowedUpdates).length <= 1) { 
         console.warn("No valid profile data provided to update.");
         // If only updatedAt is left, no actual user data change was requested
         // Depending on desired behavior, you might throw an error or just return
         // Let's return silently for now, as it means no changes were made by the user
         // that fit the allowed fields.
         return; 
    }


    try {
        // Use updateDoc which only modifies specified fields. Using setDoc with merge:true
        // is also an option but updateDoc is arguably clearer for partial updates.
        await updateDoc(userRef, allowedUpdates);
        console.log("User profile updated successfully for:", uid, "with data:", allowedUpdates);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error; // Re-throw error
    }
};

// Example: Function to check if a username is unique (if you add usernames)
export const isUsernameUnique = async (username: string): Promise<boolean> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("username", "==", username)); // Assuming 'username' field exists
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty; // True if no documents match (username is unique)
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        throw error;
    }
};
