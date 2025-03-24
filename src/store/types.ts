export interface MappedShow {
  id: number
  name: string
  image: string | null
  summary: string | null
  rating: number | null
  year: string | null
}

export interface GenresMap {
  [key: string]: MappedShow[]
}

export interface StoreState {
  genres: GenresMap
  isLoading: boolean
  error: string | null
}
