import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function Icon({ type, id }) {
  const [src, setSrc] = useState('')
  const [options, setOptions] = useState({
    width: 6,
    height: 6,
  })

  const fallback = '/images/noimage.svg'

  useEffect(() => {
    if (type === 'sports') {
      setSrc(`/images/icons/sportsbook/discipline/${id}.svg`)
    }

    if (type === 'locations') {
      setSrc(`/images/icons/sportsbook/flag/${id}.png`)
      setOptions({
        width: 5,
        height: 5,
      })
    }
  }, [])

  return (
    <Image
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          setSrc(fallback)
        }
      }}
      onError={() => {
        setSrc(fallback)
      }}
      src={src || fallback}
      className={`w-${options.width} h-auto rounded-full`}
      width={options.width}
      height={options.height}
      alt="icon"
    />
  )
}
