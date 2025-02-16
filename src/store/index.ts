import { defineStore } from 'pinia'
import type { StoreState, GenresMap } from './types'

export const useStore = defineStore('store', {
  state: (): StoreState => ({
    genres: {},
    isLoading: false,
    error: null,
  }),
  actions: {
    setGenres(genres: GenresMap) {
      this.genres = genres
      // TODO: persist genres???
      // localStorage.setItem('genres', JSON.stringify(genres))
    },
    setLoading(loading: boolean) {
      this.isLoading = loading
    },
    setError(error: string | null) {
      this.error = error
    },
  },
  getters: {
    showsByGenre: (state) => {
      return (genre: string) => state.genres[genre] || []
    },
  },
})
