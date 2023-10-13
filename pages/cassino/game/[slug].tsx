import { GetServerSideProps } from 'next'

import nextI18nextConfig from 'next-i18next.config.cjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import axios from 'axios'

import { Game as GameProps } from 'types/casino'

import { Game as GameComponent } from '@/components/Casino/Game'

export default function Game({ game }: { game: GameProps }) {
  return <GameComponent game={game} />
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
  res,
}) => {
  try {
    const gameSlug = params.slug
    const gameUrl = `${process.env.NEXT_PUBLIC_CASINO_API_URL}/games?filter=slug%3D${gameSlug}&language=pt&orderBy=DES&selectedCountryCode=BR`
    const { data } = await axios.get(gameUrl)
    if (data.items.length === 0) {
      res.writeHead(302, {
        Location: '/cassino',
      })
      res.end()
      return;
    }
    const game = data?.items[0]

    return {
      props: {
        game,
        ...(await serverSideTranslations(
          locale,
          ['common'],
          nextI18nextConfig,
        )),
      },
    }
  } catch (error) {
    res.writeHead(302, {
      Location: '/cassino',
    })
    res.end()
  }
}
