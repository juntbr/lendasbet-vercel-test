import React from 'react'
import Image from 'next/legacy/image'

export const LoadingFallback: React.FC = () => {
  return (
    <div className="relative flex flex-row items-center justify-center w-screen h-screen bg-background">
      <Image
        src="/images/Logo.svg"
        alt="Lendas Bet Logo"
        className="h-auto w-72 animate-pulse"
        width={300}
        height={300}
        priority
      />
    </div>
  )
}

export default LoadingFallback
