import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, it, expect } from 'vitest'
import { useStore } from '../index'
import type { GenresMap } from '../types'

describe('Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

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
  })

  describe('getters', () => {
    it('should return shows by genre', () => {
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

      expect(store.showsByGenre('drama')).toEqual([
        {
          id: 1,
          name: 'Show 1',
          image: '',
          summary: '',
          rating: 0,
          year: '0',
        },
      ])
      expect(store.showsByGenre('comedy')).toEqual([
        {
          id: 2,
          name: 'Show 2',
          image: '',
          summary: '',
          rating: 0,
          year: '0',
        },
      ])
    })

    it('should return empty array for non-existent genre', () => {
      const store = useStore()
      expect(store.showsByGenre('non-existent')).toEqual([])
    })
  })
})
