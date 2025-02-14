import { defineStore } from 'pinia'
import type { Show } from '@/api/types'
import type { StoreState } from './types'

export const useStore = defineStore('shows', {
  state: (): StoreState => ({
    shows: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    setShows(shows: Show[]) {
      this.shows = shows
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
