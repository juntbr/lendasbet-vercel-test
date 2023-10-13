import { KeenSliderOptions } from 'keen-slider'
import { useCasino } from '@/hooks/useCasino'
import { useTranslation } from 'next-i18next'
import { Carousel } from 'design-system/carousel/Carousel'
import { Button } from 'design-system/button'
import useWindowSize from '@/hooks/UseWindowSize'

export const FilterByGame = () => {
  const {
    activeCasino,
    changeGameCurrentCategory,
    categoriesWithAllGamesCategory,
  } = useCasino()
  const { t } = useTranslation(['common'])
  const { isMobile } = useWindowSize()

  const options: KeenSliderOptions = {
    slides: { perView: 'auto', spacing: 8 },
    renderMode: 'performance',
    drag: !!isMobile,
    loop: true,
    mode: 'snap',
  }

  return (
    <div className="relative p-1 rounded-full lg:bg-transparent lg:p-0">
      <Carousel {...options}>
        {categoriesWithAllGamesCategory?.map((category, i) => (
          <Button
            key={`${category?.id}-${i}`}
            onClick={() => changeGameCurrentCategory(category?.name)}
            variant={activeCasino === category?.name ? 'primary' : 'outline'}
            className="keen-slider__slide !rounded-full"
            size="small"
            style={{
              maxWidth: 13 * category?.name.length,
              minWidth: 13 * category?.name.length,
            }}
          >
            {t(category?.name)}
          </Button>
        ))}
      </Carousel>
    </div>
  )
}
