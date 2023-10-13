import Image from 'next/image'
import { useCasino } from '@/hooks/useCasino'

const games = [
  {
    name: 'Aviator',
    slug: 'aviator-spribe',
    img: '/images/mostPlayed/aviator.svg',
  },
  { name: 'Mines', slug: 'mines-spribe', img: '/images/mostPlayed/mines.svg' },
  {
    name: 'Spaceman',
    slug: 'spaceman_pragmaticplay',
    img: '/images/mostPlayed/spaceman.svg',
  },
  {
    name: 'Neon Shapes',
    slug: 'neonshapes_evoplay',
    img: '/images/mostPlayed/neon-shapes.svg',
  },
  {
    name: 'Sweet Bonanza™',
    slug: 'sweet-bonanza-pragmatic',
    img: '/images/mostPlayed/sweet-bonanza.svg',
  },
]

export default function Populars() {
  const { openCasinoGame } = useCasino()

  return (
    <ul className="flex flex-col items-start justify-center px-1 space-y-4">
      {games.map((game, i) => {
        return (
          <li
            className="flex items-start justify-start w-full"
            key={i}
            title={game.name}
          >
            <button
              onClick={() => openCasinoGame(game.slug)}
              className="flex items-center justify-start w-full space-x-4 font-medium group"
            >
              <Image
                width={20}
                height={20}
                className="w-6 h-6 rounded-lb"
                alt={game.name}
                src={game.img}
              />
              <span className="text-sm font-bold leading-6 transition-all duration-300 ease-in-out whitespace-nowrap text-neutral-20 group-hover:text-white">
                {game.name}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
