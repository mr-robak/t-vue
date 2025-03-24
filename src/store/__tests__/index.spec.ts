import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, it, expect } from 'vitest'
import { useStore } from '../index'
import type { MappedShow, GenresMap } from '../types'

describe('Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockShow: MappedShow = {
    id: 1,
    name: 'Test Show',
    image: 'test.jpg',
    summary: 'Test summary',
    rating: 8.5,
    year: '2020',
  }

  describe('initial state', () => {
    it('should have empty initial state', () => {
      const store = useStore()
      expect(store.genres).toEqual({})
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('actions', () => {
    it('should set genres', () => {
      const store = useStore()
      const genres: GenresMap = {
        drama: [
          {
            id: 1,
            name: 'Show 1',
            image: '',
            summary: '',
            rating: 0,
            year: '0',
          },
        ],
        comedy: [
          {
            id: 2,
            name: 'Show 2',
            image: '',
            summary: '',
            rating: 0,
            year: '0',
          },
        ],
      }

      store.setGenres(genres)
      expect(store.genres).toEqual(genres)
    })

    it('should set loading state', () => {
      const store = useStore()

      store.setLoading(true)
      expect(store.isLoading).toBe(true)

      store.setLoading(false)
      expect(store.isLoading).toBe(false)
    })

    it('should set error', () => {
      const store = useStore()
      const errorMessage = 'Test error'

      store.setError(errorMessage)
      expect(store.error).toBe(errorMessage)

      store.setError(null)
      expect(store.error).toBeNull()
    })

    it('should add shows to a new genre', () => {
      const store = useStore()
      store.addShowsToGenre('Drama', [mockShow])

      expect(store.genres.Drama).toEqual([mockShow])
    })

    it('should merge shows into existing genre maintaining sort order', () => {
      const store = useStore()
      const higherRatedShow: MappedShow = { ...mockShow, id: 2, rating: 9.0 }
      const lowerRatedShow: MappedShow = { ...mockShow, id: 3, rating: 7.0 }

      store.addShowsToGenre('Drama', [mockShow])
      store.addShowsToGenre('Drama', [higherRatedShow, lowerRatedShow])

      expect(store.genres.Drama).toEqual([
        higherRatedShow,
        mockShow,
        lowerRatedShow,
      ])
    })

    it('should handle shows with null ratings', () => {
      const store = useStore()
      const showWithNullRating: MappedShow = {
        ...mockShow,
        id: 2,
        rating: null,
      }

      store.addShowsToGenre('Drama', [mockShow])
      store.addShowsToGenre('Drama', [showWithNullRating])

      expect(store.genres.Drama).toEqual([mockShow, showWithNullRating])
    })
  })

  describe('getters', () => {
    it('should return shows by genre', () => {
      const store = useStore()
      store.addShowsToGenre('Drama', [mockShow])

      expect(store.showsByGenre('Drama')).toEqual([mockShow])
      expect(store.showsByGenre('drama')).toEqual([mockShow])
      expect(store.showsByGenre('Comedy')).toEqual([])
    })

    it('should return empty array for non-existent genre', () => {
      const store = useStore()
      expect(store.showsByGenre('non-existent')).toEqual([])
    })
  })
})
