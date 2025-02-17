import { sleep } from '@/utilities/helpers'
import { API } from '@/assets/constants'
import type { SearchResult, Show } from './types'

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch shows: Error: ${error.message}`)
      }
      throw new Error('Failed to fetch shows: an unknown error occurred')
    }
  }

  return shows
}

export async function fetchShowDetails(id: number): Promise<Show> {
  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.SHOWS}/${id}?embed=cast`,
  )
  if (!response.ok) {
    throw new Error(
      `Failed to fetch show details: ${response.status} ${response.statusText}`,
    )
  }
  return response.json()
}

export async function searchShows(query: string): Promise<SearchResult[]> {
  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.SEARCH_SHOWS}?q=${encodeURIComponent(query)}`,
  )
  if (!response.ok) {
    throw new Error('Search failed')
  }
  return response.json()
}
