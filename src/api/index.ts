import { sleep } from '@/utilities/helpers'
import { API } from '@/assets/constants'
import type { Show } from './types'

async function fetchPage(page: number): Promise<Show[]> {
  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.SHOWS}?page=${page}`,
  )

  if (response.status === 429) {
    await sleep(API.RATE_LIMIT_DELAY)
    return fetchPage(page)
  }

  return response.json()
}

export async function fetchAllShows(): Promise<Show[]> {
  let page = 0
  let shows: Show[] = []
  let hasMore = true

  while (hasMore) {
    try {
      const data = await fetchPage(page)

      if (data.length === 0) {
        hasMore = false
      } else {
        shows = [...shows, ...data]
        page++
      }
    } catch (error) {
      throw new Error(`Failed to fetch shows: ${error}`)
    }
  }

  return shows
}
