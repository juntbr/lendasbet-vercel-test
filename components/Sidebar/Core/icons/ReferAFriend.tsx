import React from 'react'

type Props = {
  width: number | string
  height: number | string
  active: boolean
}

export default function ReferAFriend({ width, height, active = false }: Props) {
  const color = active ? '#ffffff' : '#747474'
  return (
    <svg
      fill={color}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Layer_2" data-name="Layer 2">
        <path d="m16 16.5v2a3.00887 3.00887 0 0 1 -3 3h-8a3.00887 3.00887 0 0 1 -3-3v-2a5.03832 5.03832 0 0 1 2.18994-4.15h.01006a6.43321 6.43321 0 0 0 9.6001 0h.01a5.03832 5.03832 0 0 1 2.1899 4.15z" />
        <circle cx={9} cy={8} r="5.5" />
        <path d="m21 11.5h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z" />
        <path d="m19 13.5a.99943.99943 0 0 1 -1-1v-4a1 1 0 0 1 2 0v4a.99943.99943 0 0 1 -1 1z" />
      </g>
    </svg>
  )
}
