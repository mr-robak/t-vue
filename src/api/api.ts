import { sleep } from '@/utilities/helpers'
import type { Show } from './types'

export async function fetchShows(page: number = 0): Promise<Show[]> {
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.tvmaze.com'
  const url = `${API_URL}/shows?page=${page}`

  const response = await fetch(url)
  if (response.status === 429) {
    await sleep(1500)
    return fetchShows(page)
  }

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch shows: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchAllShows(): Promise<Show[]> {
  let page = 0
  let allShows: Show[] = []

  while (true) {
    try {
      const shows = await fetchShows(page)
      if (shows.length === 0) break
      allShows = allShows.concat(shows)
      page++
      await sleep(60) // Delay ~60ms to stay under 20 calls per second
    } catch (error) {
      console.error('Error fetching page', page, error)
      break
    }
  }

  return allShows
}
