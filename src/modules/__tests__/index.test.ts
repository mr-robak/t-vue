import { showsModule } from '../index'
import { fetchAllShows } from '@/api'
import { useStore } from '@/store'
import type { Show } from '@/api/types'
import type { MappedShow } from '@/store/types'

vi.mock('@/api', () => ({
  fetchAllShows: vi.fn(),
}))
vi.mock('@/store', () => {
  const storeMock = {
    genres: {},
    setLoading: vi.fn(),
    setError: vi.fn(),
    setGenres: vi.fn(),
  }
  return {
    useStore: vi.fn(() => storeMock),
  }
})

describe('showsModule', () => {
  let store: ReturnType<typeof useStore>

  beforeEach(() => {
    vi.clearAllMocks()
    store = useStore()
    store.genres = {}
  })

  describe('getGenresMap', () => {
    it('should build a genres map from an array of shows', () => {
      const shows: Partial<Show>[] = [
        {
          id: 1,
          name: 'Show One',
          genres: ['Drama', 'Comedy'],
          image: { original: 'img1.png', medium: 'img1.png' },
          summary: 'Summary 1',
          rating: { average: 8 },
          premiered: '2021-01-01',
        },
        {
          id: 2,
          name: 'Show Two',
          genres: ['Drama'],
          image: { original: 'img2.png', medium: 'img2.png' },
          summary: 'Summary 2',
          rating: { average: 9 },
          premiered: '2020-05-05',
        },
      ]

      const genresMap = showsModule.getGenresMap(shows as Show[])
      expect(Object.keys(genresMap)).toContain('Drama')
      expect(Object.keys(genresMap)).toContain('Comedy')
      expect(genresMap['Drama']).toHaveLength(2)
      expect(genresMap['Comedy']).toHaveLength(1)
      expect(genresMap['Comedy'][0]).toEqual({
        id: 1,
        name: 'Show One',
        image: 'img1.png',
        summary: 'Summary 1',
        rating: 8,
        year: '2021',
      })
    })
  })

  describe('sortByRating', () => {
    const data: MappedShow[] = [
      { id: 1, name: 'A', image: null, summary: '', rating: 5, year: '2019' },
      { id: 2, name: 'B', image: null, summary: '', rating: 8, year: '2020' },
      {
        id: 3,
        name: 'C',
        image: null,
        summary: '',
        rating: null,
        year: '2021',
      },
    ]

    it('should sort shows descending by default', () => {
      const sorted = showsModule.sortByRating([...data])
      expect(sorted).toEqual([
        { id: 2, name: 'B', image: null, summary: '', rating: 8, year: '2020' },
        { id: 1, name: 'A', image: null, summary: '', rating: 5, year: '2019' },
        {
          id: 3,
          name: 'C',
          image: null,
          summary: '',
          rating: null,
          year: '2021',
        },
      ])
    })

    it('should sort shows ascending when specified', () => {
      const sorted = showsModule.sortByRating([...data], 'asc')
      expect(sorted).toEqual([
        {
          id: 3,
          name: 'C',
          image: null,
          summary: '',
          rating: null,
          year: '2021',
        },
        { id: 1, name: 'A', image: null, summary: '', rating: 5, year: '2019' },
        { id: 2, name: 'B', image: null, summary: '', rating: 8, year: '2020' },
      ])
    })
  })

  describe('fetchShows', () => {
    it('should not fetch new shows if store already has genres', async () => {
      store.genres = { Drama: [] }
      await showsModule.fetchShows()
      expect(store.setLoading).not.toHaveBeenCalled()
      expect(fetchAllShows).not.toHaveBeenCalled()
    })

    it('should fetch shows, process them, and update the store', async () => {
      store.genres = {}
      const mockShows: Partial<Show>[] = [
        {
          id: 1,
          name: 'Mock Show',
          genres: ['Drama'],
          image: { original: 'img.png', medium: 'img.png' },
          summary: 'A mock show',
          rating: { average: 7 },
          premiered: '2022-03-03',
        },
      ]
      const fetchAllShowsMock = vi.mocked(fetchAllShows)
      fetchAllShowsMock.mockResolvedValue(mockShows as Show[])

      await showsModule.fetchShows()

      expect(store.setLoading).toHaveBeenCalledWith(true)
      expect(fetchAllShows).toHaveBeenCalled()
      expect(store.setGenres).toHaveBeenCalled()

      const genresArg = (store.setGenres as vi.Mock).mock.calls[0][0]
      expect(genresArg).toHaveProperty('Drama')
      expect(genresArg['Drama'][0]).toEqual({
        id: 1,
        name: 'Mock Show',
        image: 'img.png',
        summary: 'A mock show',
        rating: 7,
        year: '2022',
      })
      expect(store.setLoading).toHaveBeenLastCalledWith(false)
    })

    it('should set error on fetch failure', async () => {
      store.genres = {}
      const errorMsg = 'API Error'
      const fetchAllShowsMock = fetchAllShows as unknown as vi.Mock
      fetchAllShowsMock.mockRejectedValue(new Error(errorMsg))

      await showsModule.fetchShows()

      expect(store.setError).toHaveBeenCalledWith(errorMsg)
      expect(store.setLoading).toHaveBeenLastCalledWith(false)
    })
  })
})
