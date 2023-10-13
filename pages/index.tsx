import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.writeHead(302, {
    Location: '/cassino',
  })

  res.end()

  return {
    props: {},
  }
}

export default function Home() {
  return null
}
