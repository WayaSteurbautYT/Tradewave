import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestoreService';

export async function middleware(request: NextRequest) {
  const user = auth.currentUser;
  const path = request.nextUrl.pathname;

  // If user is not authenticated, redirect to signin
  if (!user) {
    if (path !== '/signin') {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }

  // If user is authenticated, fetch profile
  const profile = await getUserProfile(user.uid);

  // If no role is set, redirect to select-role
  if (!profile?.role) {
    if (path !== '/select-role') {
      return NextResponse.redirect(new URL('/select-role', request.url));
    }
    return NextResponse.next();
  }

  // If role is set but no stripeCustomerId, redirect to payment-setup
  if (profile.role && !profile.stripeCustomerId) {
    if (path !== '/payment-setup') {
      return NextResponse.redirect(new URL('/payment-setup', request.url));
    }
    return NextResponse.next();
  }

  // If email is not verified, redirect to verify-email
  if (!user.emailVerified) {
    if (path !== '/verify-email') {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
    return NextResponse.next();
  }

  // If all conditions are met, redirect to dashboard
  if (path === '/' || path === '/signin' || path === '/select-role' || path === '/payment-setup' || path === '/verify-email') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/signin', '/select-role', '/payment-setup', '/verify-email', '/dashboard', '/profile/:path*'],
};
