import { Button } from 'design-system/button'
import Image from 'next/image'

export default function TypeBanner2({
  type,
  text,
  bgImg,
  gradient,
  color,
  gradientBtn,
  onClick,
}) {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Image
        src={bgImg}
        alt="banner"
        width={100}
        height={100}
        loader={({ width, quality }) =>
          `${bgImg}?w=${width}&q=${quality || 75}`
        }
        className="w-full h-auto rounded-t-md"
      />
      <div
        style={{
          background: gradient,
        }}
        className="flex flex-col items-center justify-center px-4 pb-4 overflow-hidden rounded-b-md"
      >
        <span className={`${color} py-3 text-xs lg:text-sm`}>{text}</span>

        <Button
          onClick={onClick}
          style={{ background: gradientBtn }}
          className="group relative w-full max-w-[290px] border-none text-white shadow-2xl hover:!text-white md:py-3 lg:max-w-full lg:uppercase"
        >
          {type}
          <div className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 rounded-lb group-hover:scale-100 group-hover:bg-black/10 "></div>
        </Button>
      </div>
    </div>
  )
}
