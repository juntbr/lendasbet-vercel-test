import Image from 'next/image'

export default function LoadingGames() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full pb-20 bg-secondary lg:pb-0">
      <Image
        src="/images/Logo.svg"
        alt="Lendas Bet Logo"
        className="h-auto w-72 animate-pulse"
        width={160}
        height={160}
        priority
      />
      <h2 className="mt-2 font-bold animate-pulse text-primary lg:mt-4 lg:text-2xl">
        Estamos carregando seu jogo...
      </h2>
    </div>
  )
}
