import type { Show } from '@/api/types'

export interface StoreState {
  genres: GenresMap
  isLoading: boolean
  error: string | null
}

export interface ShowsMap {
  [id: number]: Show
}

export interface GenreShow {
  id: number
  name: string
  image: string | null
  summary: string | null
  rating: number | null
}

export type GenresMap = Record<string, GenreShow[]>
