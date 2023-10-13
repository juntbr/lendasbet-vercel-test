import { LayoutResponse } from './types'

async function fetchOptimoveIntelligentLayout(
  userId: string,
  channel: string,
): Promise<LayoutResponse> {
  try {
    const params = {
      userId,
      type: 'layout',
      context: {
        channel,
      },
      recommendation: {
        target: {
          getDetails: true,
        },
      },
    }

    const response = await fetch(
      'https://api.opti-x.optimove.net/intelligentlayouts/v1/layouts/579d7334-3db8-4d85-8e92-459f6804bde3/layout',
      {
        method: 'POST',
        headers: {
          'x-nolog': '1',
          'x-brand-key': process.env.NEXT_PUBLIC_OPTIMOVE_BRAND_KEY,
          'x-api-key': process.env.NEXT_PUBLIC_OPTIMOVE_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify(params),
      },
    )

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`)
    }

    const data = await response.json()

    return data
  } catch (error) {
    // console.error('Error:', error)
    throw error // You can choose to handle the error as needed
  }
}

export { fetchOptimoveIntelligentLayout }
