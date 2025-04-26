// app/signin/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI Button
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'; // Assuming Shadcn UI Card
import { useAuth } from '@/contexts/AuthContext'; // Use AuthContext to check status

export default function SignInPage() {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Redirect logged-in users based on role status once loading is complete
    React.useEffect(() => {
        if (!loading && user) {
            if (userProfile === undefined) {
                 // Still waiting for profile data after user is confirmed
                 console.log("SignInPage useEffect: User logged in, waiting for profile data...");
                 // Optionally show a brief loading state here if needed
            } else if (userProfile?.role) {
                 // User logged in and has a role, go to overview
                 console.log(`SignInPage useEffect: User has role '${userProfile.role}', redirecting to overview.`);
                 router.replace('/profile/overview');
            } else if (userProfile === null || !userProfile?.role) {
                 // User logged in, profile fetched, but no role assigned (or profile missing - though upsertUser should prevent null)
                 console.log("SignInPage useEffect: User logged in, no role found.");
            }
        }
        // No redirect if !user (remain on signin page)
    }, [user, userProfile, loading, router]); // Depends on user, userProfile, and loading

    const handleGoogleSignIn = async () => {
        setError(null);
        setIsLoggingIn(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            console.log("Sign-in successful.");
        } catch (err: any) {
            console.error("Sign-in error:", err);
            setError(err.message);
            setIsLoggingIn(false);
        }
    };

    const handleEmailSignIn = async () => {
        setError(null);
        setIsLoggingIn(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Email sign-in successful.");
        } catch (err: any) {
            console.error("Email sign-in error:", err);
            setError(err.message);
            setIsLoggingIn(false);
        }
    };

    const handleEmailSignUp = async () => {
        setError(null);
        setIsSigningUp(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Email sign-up successful.");
        } catch (err: any) {
            console.error("Email sign-up error:", err);
            setError(err.message);
            setIsSigningUp(false);
        }
    };

    const handleAnonymousSignIn = async () => {
        setError(null);
        setIsLoggingIn(true);
        try {
            await signInAnonymously(auth);
            console.log("Anonymous sign-in successful.");
        } catch (err: any) {
            console.error("Anonymous sign-in error:", err);
            setError(err.message);
            setIsLoggingIn(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {/* Add a nicer loading spinner here */}
                <p>Loading authentication status...</p>
            </div>
        ); // Or a spinner component
    }

    if (user) {
        // Render null or a loading/redirecting message while useEffect redirect happens
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Redirecting...</p>
            </div>
        ); 
    }

    // Render sign-in page only if not loading and not logged in
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Sign In to TradeWave</CardTitle>
                    <CardDescription className="text-center pt-2">
                        Choose your preferred method to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your email"
                        />
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your password"
                        />
                        <div className="flex space-x-2">
                            <Button
                                onClick={handleEmailSignIn}
                                disabled={isLoggingIn || isSigningUp}
                                className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {isLoggingIn ? 'Signing In...' : 'Sign In'}
                            </Button>
                            <Button
                                onClick={handleEmailSignUp}
                                disabled={isLoggingIn || isSigningUp}
                                className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center my-4">
                        <div className="border-t border-gray-300 flex-grow"></div>
                        <span className="px-2 text-gray-500">OR</span>
                        <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <Button
                        onClick={handleGoogleSignIn}
                        disabled={isLoggingIn || isSigningUp}
                        className="w-full bg-white text-black border border-gray-300 p-2 rounded hover:bg-gray-100 disabled:bg-gray-400"
                    >
                        Sign in with Google
                    </Button>
                    <Button
                        onClick={handleAnonymousSignIn}
                        disabled={isLoggingIn || isSigningUp}
                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
                    >
                        Sign in Anonymously
                    </Button>
                    {error && <div className="mt-2 text-red-600">{error}</div>}
                </CardContent>
                <CardFooter className="flex justify-center text-xs text-muted-foreground">
                    <p className="text-center px-4">By signing in, you agree to our Terms and Privacy Policy.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
