import { defineStore } from 'pinia'
import type { StoreState, GenresMap, MappedShow } from './types'

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
    addShowsToGenre(genre: string, newShows: MappedShow[]) {
      if (!this.genres[genre]) {
        this.genres[genre] = newShows
        return
      }

      const existing = this.genres[genre]
      const merged: MappedShow[] = []
      let i = 0,
        j = 0

      while (i < existing.length && j < newShows.length) {
        if ((existing[i].rating || 0) >= (newShows[j].rating || 0)) {
          if (
            !merged.length ||
            merged[merged.length - 1].id !== existing[i].id
          ) {
            merged.push(existing[i])
          }
          i++
        } else {
          if (
            !merged.length ||
            merged[merged.length - 1].id !== newShows[j].id
          ) {
            merged.push(newShows[j])
          }
          j++
        }
      }

      while (i < existing.length) {
        if (!merged.length || merged[merged.length - 1].id !== existing[i].id) {
          merged.push(existing[i])
        }
        i++
      }
      while (j < newShows.length) {
        if (!merged.length || merged[merged.length - 1].id !== newShows[j].id) {
          merged.push(newShows[j])
        }
        j++
      }

      this.genres[genre] = merged
    },
  },
  getters: {
    showsByGenre: (state) => {
      return (genre: string) => {
        const normalizedGenre = Object.keys(state.genres).find(
          (key) => key.toLowerCase() === genre.toLowerCase(),
        )
        return normalizedGenre ? state.genres[normalizedGenre] : []
      }
    },
  },
})
