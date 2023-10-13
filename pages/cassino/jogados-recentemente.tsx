import { RecentlylPlayedPage } from '@/components/Casino/RecentlylPlayedPage'
import { useAuth } from '@/hooks/useAuth'
import { useIntelligentLayouts } from '@/hooks/useOptix/useIntelligentLayouts'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function JogadosRecentemente() {
  const { recentlyPlayedGames } = useIntelligentLayouts()
  const { push } = useRouter()
  const { isLogged } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLogged) {
        push('/cassino')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLogged])

  return <RecentlylPlayedPage games={recentlyPlayedGames} />
}
