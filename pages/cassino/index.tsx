import { NotAuthenticatedCasino } from '@/components/Casino/NotAuthenticatedCasino'
import { GetStaticProps } from 'next'
import nextI18nextConfig from 'next-i18next.config.cjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function Cassino() {
  return <NotAuthenticatedCasino isLive={false} />
}

export default Cassino

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const res = await fetch(
    'https://lendasbet.nwacdn.com/v1/casino/groups/TESTELOBBY?fields=id,name,games&expand=games',
  )

  const response = await res.json()

  console.log({ response })

  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'sidebar'],
        nextI18nextConfig,
      )),
    },
  }
}
