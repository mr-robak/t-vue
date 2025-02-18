import { showsModule } from '../index'
import { fetchAllShows } from '@/api'
import { useStore } from '@/store'
import type { Show } from '@/api/types'
import { vi, describe, beforeEach, it, expect } from 'vitest'

vi.mock('@/api')
vi.mock('@/store', () => ({
  useStore: vi.fn(),
}))

describe('showsModule', () => {
  const mockStore = {
    genres: {},
    setLoading: vi.fn(),
    setError: vi.fn(),
    setGenres: vi.fn(),
  }

  const mockShows: Show[] = [
    {
      id: 1,
      name: 'Show 1',
      genres: ['Drama', 'Comedy'],
      rating: { average: 8.5 },
      image: { medium: 'image1.jpg' },
      summary: 'Summary 1',
      premiered: '2020-01-01',
    },
    {
      id: 2,
      name: 'Show 2',
      genres: ['Comedy'],
      rating: { average: 9.0 },
      image: null,
      summary: null,
      premiered: null,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.genres = {}
    mockStore.setLoading.mockClear()
    mockStore.setError.mockClear()
    mockStore.setGenres.mockClear()
    vi.mocked(useStore).mockReturnValue(mockStore)
    vi.mocked(fetchAllShows).mockResolvedValue(mockShows)
  })

  describe('fetchShows', () => {
    it('should early return if genres are already loaded', async () => {
      mockStore.genres = { Drama: [] }
      await showsModule.fetchShows()

      expect(fetchAllShows).not.toHaveBeenCalled()
      expect(mockStore.setLoading).not.toHaveBeenCalled()
    })

    it('should fetch and process shows successfully', async () => {
      await showsModule.fetchShows()

      expect(mockStore.setLoading).toHaveBeenCalledWith(true)
      expect(fetchAllShows).toHaveBeenCalled()
      expect(mockStore.setGenres).toHaveBeenCalled()
      expect(mockStore.setError).toHaveBeenCalledWith(null)
      expect(mockStore.setLoading).toHaveBeenLastCalledWith(false)
    })

    it('should handle errors appropriately', async () => {
      const error = new Error('API Error')
      ;(fetchAllShows as jest.Mock).mockRejectedValue(error)

      await showsModule.fetchShows()

      expect(mockStore.setError).toHaveBeenCalledWith('API Error')
      expect(mockStore.setLoading).toHaveBeenLastCalledWith(false)
    })
  })

  describe('getGenresMap', () => {
    it('should correctly map shows to genres', () => {
      const result = showsModule.getGenresMap(mockShows)

      expect(Object.keys(result)).toEqual(['Drama', 'Comedy'])
      expect(result.Drama).toHaveLength(1)
      expect(result.Comedy).toHaveLength(2)
    })

    it('should handle shows with missing optional fields', () => {
      const result = showsModule.getGenresMap(mockShows)

      expect(result.Comedy[1]).toEqual({
        id: 2,
        name: 'Show 2',
        image: null,
        summary: null,
        rating: 9.0,
        year: null,
      })
    })
  })

  describe('sortByRating', () => {
    const shows = [
      { id: 1, name: 'Show 1', rating: 8.5 },
      { id: 2, name: 'Show 2', rating: 9.0 },
      { id: 3, name: 'Show 3', rating: null },
    ]

    it('should sort shows by rating in descending order by default', () => {
      const result = showsModule.sortByRating(shows)

      expect(result[0].rating).toBe(9.0)
      expect(result[1].rating).toBe(8.5)
      expect(result[2].rating).toBe(null)
    })

    it('should sort shows by rating in ascending order', () => {
      const result = showsModule.sortByRating(shows, 'asc')

      expect(result[0].rating).toBe(null)
      expect(result[1].rating).toBe(8.5)
      expect(result[2].rating).toBe(9.0)
    })

    it('should handle empty array', () => {
      const result = showsModule.sortByRating([])
      expect(result).toEqual([])
    })
  })
})
