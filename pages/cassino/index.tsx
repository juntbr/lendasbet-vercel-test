import { NotAuthenticatedCasino } from '@/components/Casino/NotAuthenticatedCasino'
import axios from 'axios'
import { GetServerSideProps } from 'next'

export const dynamic = 'force-static'
export const fetchCache = 'auto'


function Cassino({ games }) {
  console.log({games})
  return <NotAuthenticatedCasino isLive={false} />
}

export default Cassino



export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  const { data } = await axios.get(
    'https://lendasbet.nwacdn.com/v1/casino/groups/TESTELOBBY?fields=id,name,games&expand=games',
  )

  return {
    props: {
      games: data,
    },
  }
}
