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
    },
    setLoading(loading: boolean) {
      this.isLoading = loading
    },
    setError(error: string | null) {
      this.error = error
    },
  },
  getters: {},
})
