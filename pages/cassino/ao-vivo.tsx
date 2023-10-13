import { NotAuthenticatedCasino } from '@/components/Casino/NotAuthenticatedCasino'
import { GetStaticProps } from 'next'
import nextI18nextConfig from 'next-i18next.config.cjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function LiveCasino() {
  return <NotAuthenticatedCasino isLive={true} />
}

export default LiveCasino

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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
