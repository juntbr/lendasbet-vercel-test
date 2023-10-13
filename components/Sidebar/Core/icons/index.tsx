import React from 'react'
import dynamic from 'next/dynamic'
import { IconsFilename } from '../types'

type Props = {
  name: keyof typeof IconsFilename
  width?: number | string
  height?: number | string
  active?: boolean
}

type IconProps = {
  width: number | string
  height: number | string
  active: boolean
}

export default function Icons({
  name,
  width = 20,
  height = 20,
  active = false,
}: Props) {
  const configSuspense = {
    suspense: true,
  }

  const filename = IconsFilename[name]
  const Icon = dynamic<IconProps>(() => import(`./${filename}`), {
    ...configSuspense,
  })

  return <Icon width={width} height={height} active={active} />
}
