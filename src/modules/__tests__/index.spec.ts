import { showsModule } from '../index'
import { fetchAllShows } from '@/api'
import { useStore } from '@/store'
import type { Show } from '@/api/types'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import type { MappedShow } from '@/store/types'

vi.mock('@/api')
vi.mock('@/store', () => ({
  useStore: vi.fn(),
}))

describe('showsModule', () => {
  const mockStore = {
    $state: { genres: {} },
    $patch: (patch: Partial<unknown>) => Object.assign(mockStore.$state, patch),
    $reset: () => {
      /* reset logic */
    },
    $subscribe: () => () => {},
    genres: {},
    setLoading: vi.fn(),
    setError: vi.fn(),
    setGenres: vi.fn(),
  }

  const mockShows: Show[] = [
    {
      id: 1,
      url: 'http://example.com/show1',
      type: 'Scripted',
      language: 'English',
      name: 'Show 1',
      genres: ['Drama', 'Comedy'],
      status: 'Running',
      runtime: 45,
      premiered: '2020-01-01',
      officialSite: 'http://example.com',
      schedule: { time: '20:00', days: ['Monday'] },
      rating: { average: 8.5 },
      weight: 100,
      network: undefined,
      webChannel: undefined,
      dvdCountry: undefined,
      image: { medium: 'image1.jpg', original: 'image1-original.jpg' },
      summary: 'Summary 1',
      updated: 0,
      externals: { tvrage: undefined, thetvdb: undefined, imdb: undefined },
      _links: {
        self: { href: '' },
        previousepisode: {
          href: '',
          name: '',
        },
      },
    },
    {
      id: 2,
      url: 'http://example.com/show2',
      type: 'Reality',
      language: 'English',
      name: 'Show 2',
      genres: ['Comedy'],
      status: 'Ended',
      runtime: 30,
      premiered: '2019-05-01',
      officialSite: 'http://example.com/show2',
      schedule: { time: '21:00', days: ['Tuesday'] },
      rating: { average: 9.0 },
      weight: 80,
      network: undefined,
      webChannel: undefined,
      dvdCountry: undefined,
      image: undefined,
      summary: undefined,
      updated: 0,
      externals: { tvrage: undefined, thetvdb: undefined, imdb: undefined },
      _links: {
        self: { href: '' },
        previousepisode: {
          href: '',
          name: '',
        },
      },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.genres = {}
    mockStore.setLoading.mockClear()
    mockStore.setError.mockClear()
    mockStore.setGenres.mockClear()
    // @ts-expect-error mock
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
      vi.mocked(fetchAllShows).mockRejectedValueOnce(error)

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
        year: '2019',
      })
    })
  })

  describe('sortByRating', () => {
    const shows: MappedShow[] = [
      {
        id: 1,
        name: 'Show 1',
        rating: 8.5,
        image: null,
        summary: null,
        year: null,
      },
      {
        id: 2,
        name: 'Show 2',
        rating: 9.0,
        image: null,
        summary: null,
        year: null,
      },
      {
        id: 3,
        name: 'Show 3',
        rating: null,
        image: null,
        summary: null,
        year: null,
      },
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
