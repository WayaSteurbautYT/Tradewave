'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileOverviewPage() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-8 space-y-4">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-32 mt-4" />
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center">
        <p>Could not load profile information. Please try logging in again.</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/signin">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  const fallbackInitial = userProfile.displayName?.[0]?.toUpperCase() ?? userProfile.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 border-2 border-primary/20">
          <AvatarImage src={userProfile.photoURL ?? undefined} alt={userProfile.displayName ?? 'User avatar'} />
          <AvatarFallback className="text-2xl bg-muted text-foreground">
            {fallbackInitial}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{userProfile.displayName ?? 'No Display Name'}</h2>
        <p className="text-muted-foreground">{userProfile.email ?? 'No Email'}</p>
        <p className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full capitalize">
          {userProfile.role ?? 'No Role Selected'}
        </p>

        <p className="text-foreground/80 text-center italic mt-2">
          {/* Placeholder: profile.bio */}
          (Profile bio will appear here once added)
        </p>

        <div className="flex gap-2 text-sm text-muted-foreground mt-2">
          {/* Placeholder: profile.location */}
          {/* Placeholder: profile.website */}
          <span>(Location)</span>
          <span>|</span>
          <span>(Website)</span>
        </div>

        <Button asChild className="mt-6">
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>
      </div>
    </div>
  );
}