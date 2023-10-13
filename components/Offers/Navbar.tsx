import useWindowSize from '@/hooks/UseWindowSize'
import usePromotion from '@/hooks/usePromotions'
import { Button } from 'design-system/button'
import { Carousel } from 'design-system/carousel/Carousel'
import { KeenSliderOptions } from 'keen-slider'
import { useTranslation } from 'next-i18next'

export default function Navbar({ categories }) {
  const { t } = useTranslation(['common'])
  const { activeCategory, setActiveCategory } = usePromotion()
  const { isMobile } = useWindowSize()

  const defaultOptions: KeenSliderOptions = {
    slides: { perView: 'auto', spacing: 8 },
    renderMode: 'performance',
    drag: !!isMobile,
    loop: true,
    mode: 'snap',
  }

  return (
    <div className="relative mx-auto w-full rounded-full bg-secondary p-1 lg:bg-transparent lg:p-0">
      <Carousel {...defaultOptions}>
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setActiveCategory(category.slug)}
            variant={activeCategory === category.slug ? 'primary' : 'outline'}
            className="keen-slider__slide !rounded-full"
            size="small"
            style={{
              maxWidth: 12 * category?.name.length,
              minWidth: 12 * category?.name.length,
            }}
          >
            {t(category.name)}
          </Button>
        ))}
      </Carousel>
    </div>
  )
}
