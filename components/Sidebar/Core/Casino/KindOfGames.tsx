import { useRouter } from 'next/router'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import LoadingSkeletonSidebar from '@/components/Loadings/LoadingSkeletonSidebar'
import { useCasino } from '@/hooks/useCasino'
import useSidebar from '@/hooks/useSidebar'

export default function KindOfGames() {
  const { changeGameCurrentCategory, activeCasino, isCasinoLive } = useCasino()
  const { closeMenu } = useSidebar()
  const { t } = useTranslation(['common'])
  const { push, asPath } = useRouter()

  const categoriesWithIcons = [
    {
      id: 'HIGHLIGHTED',
      name: t('Ver tudo'),
      img: '/images/icones-menu-lateral/ver-todos.svg',
    },
    {
      id: 'TESTELOBBY$em-alta',
      name: t('Em Alta'),
      img: '/images/icones-menu-lateral/em-alta.svg',
    },
    {
      id: 'TESTELOBBY$crash-games',
      name: t('Crash Games'),
      img: '/images/icones-menu-lateral/crash.svg',
    },
    {
      id: 'TESTELOBBY$compra-de-bônus',
      name: t('Compra de Bônus'),
      img: '/images/icones-menu-lateral/compra-de-bonus.svg',
    },
    {
      id: 'TESTELOBBY$populares',
      name: t('Populares'),
      img: '/images/icones-menu-lateral/populares.svg',
    },
    {
      id: 'TESTELOBBY$jogos-de-mesa',
      name: t('Jogos de mesa'),
      img: '/images/icones-menu-lateral/jogos-de-mesa.svg',
    },
    {
      id: 'TESTELOBBY$lendários',
      name: t('Lendários'),
      img: '/images/icones-menu-lateral/lendarios.svg',
    },
    {
      id: 'TESTELOBBY$jogos-interativos',
      name: t('Jogos Interativos'),
      img: '/images/icones-menu-lateral/interativos.svg',
    },

    {
      id: 'TESTELOBBY$raspadinha',
      name: t('Raspadinha'),
      img: '/images/icones-menu-lateral/raspadinha.svg',
    },
  ]

  const liveCategoriesWithIcons = [
    {
      id: 'HIGHLIGHTED',
      name: t('Ver tudo'),
      img: '/images/icones-menu-lateral/em-alta.svg',
    },
    {
      id: 'LIVECASINO$populares',
      name: t('Populares'),
      img: '/images/icones-menu-lateral/populares.svg',
    },
    {
      id: 'LIVECASINO$jogos-relâmpago',
      name: t('Jogos Relâmpago'),
      img: '/images/icones-menu-lateral/jogos-relampago.svg',
    },
    {
      id: 'LIVECASINO$bingo',
      name: t('Bingo'),
      img: '/images/icones-menu-lateral/bingo.svg',
    },
    {
      id: 'LIVECASINO$roleta',
      name: t('Roleta'),
      img: '/images/icones-menu-lateral/roleta.svg',
    },
    {
      id: 'LIVECASINO$lobbys',
      name: 'Lobbys',
      img: '/images/icones-menu-lateral/lobby.svg',
    },
    {
      id: 'LIVECASINO$primeira-pessoa',
      name: t('Primeira Pessoa'),
      img: '/images/icones-menu-lateral/primeira-pessoa.svg',
    },
  ]

  if (!categoriesWithIcons) {
    return <LoadingSkeletonSidebar />
  }

  const CASINO_GAMES = isCasinoLive
    ? liveCategoriesWithIcons
    : categoriesWithIcons

  function filterPerType(game) {
    if (!asPath.includes('cassino')) {
      isCasinoLive ? push('/cassino/ao-vivo') : push('/cassino')
    }
    changeGameCurrentCategory(game.name)
    closeMenu()
  }

  return (
    <div className="w-full">
      <ul className="flex flex-col items-start justify-center px-1 space-y-4">
        {CASINO_GAMES?.map((game) => (
          <button
            key={game.id}
            onClick={() => filterPerType(game)}
            className="flex items-center w-full"
            title={game.name}
          >
            <Image
              className="w-4 h-4 mr-4"
              src={game.img}
              alt={game.name}
              width={15}
              height={15}
            />
            <span
              className={`cursor-pointer truncate whitespace-nowrap text-sm font-normal transition-all duration-300 ease-in-out  ${
                activeCasino === game.name
                  ? 'text-white'
                  : 'text-neutral-20 hover:text-white'
              }`}
            >
              {game.name}
            </span>
          </button>
        ))}
      </ul>
    </div>
  )
}
