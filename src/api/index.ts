import { sleep } from '@/utilities/helpers'
import { API } from '@/assets/constants'
import type { SearchResult, Show, ShowDetails } from './types'

async function fetchPage(page: number, retries = 0): Promise<Show[]> {
  try {
    const response = await fetch(
      `${API.BASE_URL}${API.ENDPOINTS.SHOWS}?page=${page}`,
    )

    if (response.status === 429) {
      if (retries >= API.MAX_RETRIES) {
        throw new Error('Maximum retries exceeded')
      }
      await sleep(API.RATE_LIMIT_DELAY)
      return fetchPage(page, retries + 1)
    }

    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      throw response
    }

    return response.json()
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }
    throw new Error('Failed to fetch shows: an unknown error occurred')
  }
}

export async function fetchAllShows(): Promise<Show[]> {
  const BATCH_SIZE = 3 // Adjust based on API rate limits
  let currentPage = 0
  let allShows: Show[] = []
  let hasMore = true

  while (hasMore) {
    // Create a batch of promises
    const batchPromises = Array.from({ length: BATCH_SIZE }, (_, index) =>
      fetchPage(currentPage + index).catch((error) => {
        if (error instanceof Response && error.status === 404) {
          return []
        }
        throw error
      }),
    )

    // Execute batch concurrently
    const results = await Promise.all(batchPromises)

    // Process results
    for (const shows of results) {
      if (shows.length === 0) {
        hasMore = false
        break
      }
      allShows = [...allShows, ...shows]
    }

    currentPage += BATCH_SIZE
  }

  return allShows
}

export async function fetchShowDetails(id: number): Promise<ShowDetails> {
  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.SHOWS}/${id}?embed[]=seasons&embed[]=cast&embed[]=crew&embed[]=images`,
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
