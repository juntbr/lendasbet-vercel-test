import axios from 'axios'
import { DATA_SOURCE, LIVE_DATA_SOURCE } from 'constants/casino'

export type DataSource = typeof DATA_SOURCE | typeof LIVE_DATA_SOURCE

export default async function fetchCassinoGames(dataSource: DataSource) {
  try {
    const CASINO_GROUPS_URL_BASE = `${process.env.NEXT_PUBLIC_CASINO_API_URL}/groups/DATASOURCE?fields=id,name,games&expand=games`

    const CASINO_GROUPS_URL = CASINO_GROUPS_URL_BASE.replace(
      'DATASOURCE',
      dataSource,
    )

    const response = await axios.get(CASINO_GROUPS_URL)

    return response.data
  } catch (e) {
    console.log(e)
    return null
  }
}
