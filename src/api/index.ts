import { sleep } from '@/utilities/helpers'
import { API } from '@/assets/constants'
import type { SearchResult, Show, ShowDetails } from './types'

async function fetchPage(
  page: number,
  delay = 0,
  retryCount = 0,
): Promise<Show[]> {
  if (delay) {
    await sleep(delay)
  }

  if (retryCount >= API.MAX_RETRIES) {
    throw new Error(
      `Maximum retry count (${API.MAX_RETRIES}) exceeded for page ${page}`,
    )
  }

  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.SHOWS}?page=${page}`,
  )

  if (response.status === 429) {
    await sleep(API.RATE_LIMIT_DELAY)
    return fetchPage(page, API.RATE_LIMIT_DELAY, retryCount + 1)
  }

  if (!response.ok) {
    if (response.status === 404) return []
    throw new Error(`Failed to fetch page ${page}: ${response.status}`)
  }

  return response.json()
}

export async function* streamShows(
  maxPages?: number,
): AsyncGenerator<Show[], void, undefined> {
  const INITIAL_BATCH_SIZE = 10
  const MAX_CONCURRENT = 20
  let currentPage = 0
  let batchSize = INITIAL_BATCH_SIZE
  let delay = 0
  let retryCount = 0
  let totalPagesProcessed = 0

  while (maxPages === undefined || totalPagesProcessed < maxPages) {
    try {
      const batch = Array.from(
        { length: batchSize },
        (_, i) => currentPage + i,
      ).map((page) => fetchPage(page, delay))

      const results = await Promise.all(batch)

      if (results.some((shows) => shows.length === 0)) {
        break
      }

      yield results.flat()

      totalPagesProcessed += batchSize
      currentPage += batchSize
      batchSize = Math.min(batchSize + 5, MAX_CONCURRENT)
      delay = 0
      retryCount = 0
    } catch (error) {
      console.error('Error fetching batch in streamShows, retrying:', error)
      if (retryCount >= API.MAX_RETRIES) {
        throw new Error(
          `Maximum retry count (${API.MAX_RETRIES}) exceeded in streamShows`,
        )
      }
      batchSize = Math.max(1, Math.floor(batchSize / 2))
      delay = API.RATE_LIMIT_DELAY
      retryCount++
    }
  }
}

export async function fetchAllShows(): Promise<Show[]> {
  const allShows: Show[] = []
  for await (const batch of streamShows()) {
    allShows.push(...batch)
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
