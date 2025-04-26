import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { useEffect } from 'react';

const navLinks = [
  { href: '/profile/overview', label: 'Overview' },
  { href: '/profile/edit', label: 'Edit Profile' },
  { href: '/profile/portfolio', label: 'Portfolio' },
  { href: '/profile/badges', label: 'Badges' },
  { href: '/profile/activity', label: 'Activity' },
  { href: '/profile/stats', label: 'Stats' },
  { href: '/profile/payment', label: 'Payment' },
  { href: '/profile/verification', label: 'Verification' },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && !user.emailVerified && pathname !== '/profile/verification') {
      router.replace('/profile/verification');
    }
  }, [user, pathname, router]);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-teal-950/80 border-r border-teal-800 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-teal-300 mb-4">Profile</h2>
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded transition-colors ${pathname === link.href ? 'bg-teal-800 text-white' : 'text-teal-300 hover:bg-teal-900'}`}
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
} 