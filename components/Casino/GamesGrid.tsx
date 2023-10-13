import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from 'design-system/button'
import { Carousel } from 'design-system/carousel/Carousel'
import { useCasino } from 'hooks/useCasino'
import { KeenSliderOptions } from 'keen-slider'
import { useTranslation } from 'next-i18next'
import { memo, useState } from 'react'
import { Game } from 'types/casino'
import { GameGridItem } from './GameGridItem'

interface GamesGridProps {
  games: Game[]
  category: string
  highligth: boolean
}

function Games({ games, category, highligth }: GamesGridProps) {
  const { t } = useTranslation(['common'])
  const { setActiveCasino } = useCasino()
  const [isHover, setIsHover] = useState(false)

  const animation = { duration: 25000, easing: (t: number) => t }

  const breakpoints = {
    '(min-width: 320px)': { slides: { perView: 2.2, spacing: 12 } },
    '(min-width: 768px)': { slides: { perView: 3.4, spacing: 15 } },
    '(min-width: 1024px)': { slides: { perView: 5.7, spacing: 20 } },
    '(min-width: 1524px)': { slides: { perView: 6.7, spacing: 20 } },
  }

  const defaultOptions: KeenSliderOptions = {
    initial: 0,
    breakpoints,
    slides: { perView: 6.7, spacing: 20 },
    loop: true,
    renderMode: 'performance',
    drag: true,
  }

  if (highligth && !isHover) {
    defaultOptions.slides = { perView: 6.7, spacing: 20 }
    defaultOptions.created = (s) => {
      s.moveToIdx(5, true, animation)
    }
    defaultOptions.updated = (s) => {
      s.moveToIdx(s?.track?.details?.abs + 5, true, animation)
    }
    defaultOptions.animationEnded = (s) => {
      s.moveToIdx(s?.track?.details?.abs + 5, true, animation)
    }
  }

  if (Array.isArray(games) === false || games?.length <= 0) return null

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex w-full items-center justify-between text-white">
        <h2 className="text-start font-bold text-white lg:text-lg">
          {t(category)}
        </h2>

        <Button
          variant="outline"
          size="small"
          endIcon={<ArrowRightIcon className="h-auto w-4 text-primary" />}
          onClick={() => {
            setActiveCasino(category)
            window.scrollTo(0, 0)
          }}
        >
          {t('See all')}
        </Button>
      </div>

      <Carousel {...defaultOptions}>
        {games.map((game, i) => {
          return (
            <GameGridItem
              key={i}
              game={game}
              index={i}
              highligth={highligth}
              setIsHover={setIsHover}
            />
          )
        })}
      </Carousel>
    </div>
  )
}

export const GamesGrid = memo(Games)
