import { FavoritesPage } from '@/components/Casino/FavoritesPage'
import { useAuth } from '@/hooks/useAuth'
import { useCasino } from '@/hooks/useCasino'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Favoritos() {
  const { treatedFavorites: favorites } = useCasino()
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

  return <FavoritesPage games={favorites} />
}
