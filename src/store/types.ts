export interface StoreState {
  genres: GenresMap
  isLoading: boolean
  error: string | null
}

export interface MappedShow {
  id: number
  name: string
  image: string | null
  summary: string | null
  rating: number | null
  year: string | null
}

export type GenresMap = Record<string, MappedShow[]>
