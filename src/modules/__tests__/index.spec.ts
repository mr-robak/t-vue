import { showsModule } from '../index'
import { streamShows } from '@/api'
import { useStore } from '@/store'
import type { Show } from '@/api/types'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import type { MappedShow } from '@/store/types'

vi.mock('@/api')
vi.mock('@/store')

describe('showsModule', () => {
  const mockStore = {
    genres: {} as Record<string, MappedShow[]>,
    isLoading: false,
    error: null,
    setLoading: vi.fn(),
    setError: vi.fn(),
    addShowsToGenre: vi.fn(),
    setGenres: vi.fn(),
    showsByGenre: vi.fn(),
    $state: {
      genres: {},
      isLoading: false,
      error: null,
    },
    $patch: vi.fn(),
    $reset: vi.fn(),
    $subscribe: vi.fn(),
    $dispose: vi.fn(),
    $id: 'store' as const,
    $onAction: vi.fn(),
    $watch: vi.fn(),
    _customProperties: new Set<string>(),
  }

  const mockShows: Show[] = [
    {
      id: 1,
      name: 'Test Show 1',
      genres: ['Drama', 'Comedy'],
      rating: { average: 8.5 },
      image: { medium: 'image1.jpg', original: 'image1-original.jpg' },
      summary: 'Test summary 1',
      premiered: '2020-01-01',
    },
    {
      id: 2,
      name: 'Test Show 2',
      genres: ['Comedy'],
      rating: { average: 9.0 },
      image: null,
      summary: null,
      premiered: '2019-01-01',
    },
  ] as Show[]

  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.genres = {}
    mockStore.isLoading = false
    mockStore.error = null
    mockStore.$state.genres = {}
    mockStore.$state.isLoading = false
    mockStore.$state.error = null
    vi.mocked(useStore).mockReturnValue(mockStore)
  })

  describe('fetchShows', () => {
    it('should early return if genres are already loaded', async () => {
      mockStore.genres = { Drama: [] }
      await showsModule.fetchShows()

      expect(mockStore.setLoading).not.toHaveBeenCalled()
    })

    it('should process shows and add them to store by genre', async () => {
      vi.mocked(streamShows).mockImplementation(async function* () {
        yield mockShows
        return
      })

      await showsModule.fetchShows()

      expect(mockStore.setLoading).toHaveBeenNthCalledWith(1, true)
      expect(mockStore.addShowsToGenre).toHaveBeenCalledWith(
        'Drama',
        expect.arrayContaining([
          expect.objectContaining({ id: 1, name: 'Test Show 1' }),
        ]),
      )
      expect(mockStore.addShowsToGenre).toHaveBeenCalledWith(
        'Comedy',
        expect.arrayContaining([
          expect.objectContaining({ id: 2, name: 'Test Show 2' }),
        ]),
      )
      expect(mockStore.setLoading).toHaveBeenLastCalledWith(false)
    })

    it('should handle API errors', async () => {
      const errorMsg = 'API Error'
      vi.mocked(streamShows).mockImplementation(async function* () {
        yield []
        throw new Error(errorMsg)
      })

      await showsModule.fetchShows()

      expect(mockStore.setError).toHaveBeenCalledWith(errorMsg)
      expect(mockStore.setLoading).toHaveBeenNthCalledWith(1, true)
      expect(mockStore.setLoading).toHaveBeenLastCalledWith(false)
    })
  })

  describe('getGenresMap', () => {
    it('should correctly map shows to genres', () => {
      const result = showsModule.getGenresMap(mockShows)

      const expectedDramaShow: MappedShow = {
        id: 1,
        name: 'Test Show 1',
        image: 'image1.jpg',
        summary: 'Test summary 1',
        rating: 8.5,
        year: '2020',
      }

      const expectedComedyShows: MappedShow[] = [
        {
          id: 2,
          name: 'Test Show 2',
          image: null,
          summary: null,
          rating: 9.0,
          year: '2019',
        },
        expectedDramaShow,
      ]

      expect(result.Drama).toEqual([expectedDramaShow])
      expect(result.Comedy).toEqual(expectedComedyShows)
    })

    it('should handle shows with missing data', () => {
      const incompleteShow: Show = {
        id: 3,
        name: 'Incomplete Show',
        genres: ['Drama'],
        rating: {},
      } as Show

      const result = showsModule.getGenresMap([incompleteShow])

      expect(result.Drama).toEqual([
        {
          id: 3,
          name: 'Incomplete Show',
          image: null,
          summary: null,
          rating: null,
          year: null,
        },
      ])
    })
  })
})
