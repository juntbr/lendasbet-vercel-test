import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import useSidebar from '@/hooks/useSidebar'

export default function Logo() {
  const { closeMenu } = useSidebar()

  return (
    <div className="relative z-10 flex items-center justify-between px-4 pb-1">
      <Link
        aria-label="ir para página principal"
        role="link"
        href="/cassino"
        onClick={() => {
          closeMenu()
        }}
      >
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={128}
          height={32}
          className="w-32 h-auto cursor-pointer lg:w-56"
        />
      </Link>
      <XMarkIcon
        onClick={() => closeMenu()}
        className="right-2 top-2 z-[9999] h-6 w-6 cursor-pointer text-white"
      />
    </div>
  )
}
