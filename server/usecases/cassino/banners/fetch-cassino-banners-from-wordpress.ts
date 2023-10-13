import WP from 'services/WP'
import { Banner, WordpressResponse } from './types'

export async function fetchCassinoBannersFromWordpress(): Promise<Banner[]> {
  try {
    const path = 'banners?acf_format=standard&_fields=title,acf'

    const response = await WP.get<Banner[]>(path)

    return response.data;
  } catch (e) {
    throw new Error(e)
  }
}
