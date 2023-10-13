import { useOptix } from '@/hooks/useOptix'
import Script from 'next/script'

export default function Optimove() {
  const { loadGraphyte } = useOptix()

  return <Script id="optix-load-script">{loadGraphyte}</Script>
}
