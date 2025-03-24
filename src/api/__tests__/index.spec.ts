import { fetchAllShows, fetchShowDetails, searchShows } from '../index'
import { API } from '@/assets/constants'
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest'
import { sleep } from '@/utilities/helpers'

vi.mock('@/utilities/helpers', () => ({
  sleep: vi.fn(),
}))

describe('API', () => {
  const createMockResponse = (data: unknown, status = 200) =>
    ({
      ok: status === 200,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: new Headers(),
      redirected: false,
      type: 'basic' as ResponseType,
      url: '',
      bodyUsed: false,
      json: () => Promise.resolve(data),
    }) as Response

  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchAllShows', () => {
    it('should fetch and concatenate multiple pages', async () => {
      const shows = [
        [{ id: 1, name: 'Show 1' }],
        [{ id: 2, name: 'Show 2' }],
        [{ id: 3, name: 'Show 3' }],
      ]

      // Mock responses for the first batch
      shows.forEach((page) => {
        vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse(page))
      })

      // Mock empty responses for the second batch to end pagination
      Array(3)
        .fill(null)
        .forEach(() => {
          vi.mocked(global.fetch).mockResolvedValueOnce(createMockResponse([]))
        })

      const result = await fetchAllShows()
      expect(result).toEqual(shows.flat())
      expect(global.fetch).toHaveBeenCalledTimes(6) // 3 successful + 3 empty
    })

    it('should handle empty response', async () => {
      global.fetch = vi.fn().mockResolvedValue(createMockResponse([]))
      const result = await fetchAllShows()
      expect(result).toEqual([])
    })

    // Error handling tests
    it('should handle non-200 response', async () => {
      global.fetch = vi.fn().mockResolvedValue(createMockResponse(null, 500))
      await expect(fetchAllShows()).rejects.toThrow()
    })

    // Rate limiting tests
    it('should handle rate limiting and retry', async () => {
      // Mock responses for first batch (all rate limited)
      Array(3)
        .fill(null)
        .forEach(() => {
          vi.mocked(global.fetch).mockResolvedValueOnce(
            createMockResponse(null, 429),
          )
        })

      // Mock responses for second batch (success + empty)
      vi.mocked(global.fetch)
        .mockResolvedValueOnce(createMockResponse([{ id: 1, name: 'Show 1' }]))
        .mockResolvedValueOnce(createMockResponse([]))
        .mockResolvedValueOnce(createMockResponse([]))

      const result = await fetchAllShows()

      expect(result).toHaveLength(1)
      expect(vi.mocked(sleep)).toHaveBeenCalledWith(API.RATE_LIMIT_DELAY)
      expect(vi.mocked(sleep)).toHaveBeenCalledTimes(3) // One per rate limited request
      expect(global.fetch).toHaveBeenCalledTimes(6)
    })

    it('should handle maximum retries exceeded', async () => {
      // Mock all requests to return rate limit response
      Array(3)
        .fill(null)
        .forEach(() => {
          vi.mocked(global.fetch).mockResolvedValue(
            createMockResponse(null, 429),
          )
        })

      await expect(fetchAllShows()).rejects.toThrow('Maximum retries exceeded')
      expect(vi.mocked(sleep)).toHaveBeenCalledTimes(API.MAX_RETRIES * 3) // For each concurrent request
    })
  })

  describe('fetchShowDetails', () => {
    it('should fetch show details with embeds', async () => {
      const mockShow = {
        id: 1,
        name: 'Test Show',
        _embedded: { seasons: [], cast: [], crew: [], images: [] },
      }
      global.fetch = vi.fn().mockResolvedValueOnce(createMockResponse(mockShow))

      const result = await fetchShowDetails(1)
      expect(result).toEqual(mockShow)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('embed[]=seasons'),
      )
    })

    it('should handle errors', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(createMockResponse(null, 404))
      await expect(fetchShowDetails(1)).rejects.toThrow(
        'Failed to fetch show details',
      )
    })
  })

  describe('searchShows', () => {
    it('should search shows with encoded query', async () => {
      const mockResults = [{ score: 1, show: { id: 1, name: 'Test Show' } }]
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(createMockResponse(mockResults))

      const result = await searchShows('test query')
      expect(result).toEqual(mockResults)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('test query')),
      )
    })

    it('should handle empty search results', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce(createMockResponse([]))
      const result = await searchShows('')
      expect(result).toEqual([])
    })
  })
})
