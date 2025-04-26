import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile/overview');
  }, [router]);
  return null;
}
