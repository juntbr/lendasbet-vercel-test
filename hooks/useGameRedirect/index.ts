import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useGameRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const { query } = router;

    if (query.game) {
      const slug = query.game;

      router.push(`/cassino/game/${slug}`);
    }
  }, [router]);

  return null;
};
