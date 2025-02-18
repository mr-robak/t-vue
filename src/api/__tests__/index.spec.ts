import { fetchAllShows, fetchShowDetails, searchShows } from '../index'
import { API } from '@/assets/constants'
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest'
import { sleep } from '@/utilities/helpers'

vi.mock('@/utilities/helpers', () => ({
  sleep: vi.fn(),
}))

describe('API', () => {
  const createMockResponse = (data: unknown, status = 200) => ({
    ok: true,
    status,
    json: () => Promise.resolve(data),
  })

  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchAllShows', () => {
    it('should handle non-200 response when fetching all shows', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Server Error',
      }
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      await expect(fetchAllShows()).rejects.toThrow(
        'Failed to fetch shows: an unknown error occurred',
      )
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle empty response when fetching all shows', async () => {
      const mockResponse = createMockResponse([])
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      const result = await fetchAllShows()
      expect(result).toEqual([])
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle pagination correctly', async () => {
      const page1 = [{ id: 1, name: 'Show 1' }]
      const page2 = [{ id: 2, name: 'Show 2' }]
      const emptyPage = []

      const mockResponses = [
        createMockResponse(page1),
        createMockResponse(page2),
        createMockResponse(emptyPage),
      ]

      global.fetch = vi.fn()
      mockResponses.forEach((response) => {
        vi.mocked(global.fetch).mockResolvedValueOnce(response)
      })

      const result = await fetchAllShows()

      expect(result).toEqual([...page1, ...page2])
      expect(global.fetch).toHaveBeenCalledTimes(3)
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        `${API.BASE_URL}${API.ENDPOINTS.SHOWS}?page=0`,
      )
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        `${API.BASE_URL}${API.ENDPOINTS.SHOWS}?page=1`,
      )
    })

    it('should handle rate limiting', async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
        json: () => Promise.resolve([]),
      }
      const successResponse = createMockResponse([{ id: 1, name: 'Show 1' }])

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse)
        .mockResolvedValueOnce(createMockResponse([]))

      const result = await fetchAllShows()

      expect(result).toHaveLength(1)
      expect(global.fetch).toHaveBeenCalledTimes(3)
      expect(vi.mocked(sleep)).toHaveBeenCalledWith(API.RATE_LIMIT_DELAY)
    })

    it('should handle rate limiting with maximum retries', async () => {
      const rateLimitResponse = {
        ok: false,
        status: 429,
        json: () => Promise.resolve([]),
      }
      const successResponse = createMockResponse([{ id: 1, name: 'Show 1' }])

      // Mock 3 rate limits followed by success
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse)
        .mockResolvedValueOnce(createMockResponse([]))

      const result = await fetchAllShows()

      expect(result).toHaveLength(1)
      expect(global.fetch).toHaveBeenCalledTimes(5)
      expect(vi.mocked(sleep)).toHaveBeenCalledTimes(3)
      expect(vi.mocked(sleep)).toHaveBeenCalledWith(API.RATE_LIMIT_DELAY)
    })
  })

  describe('fetchShowDetails', () => {
    it('should handle network timeout when fetching details', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network timeout'))

      await expect(fetchShowDetails(1)).rejects.toThrow('Network timeout')
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should handle malformed JSON response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON')),
      }
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      await expect(fetchShowDetails(1)).rejects.toThrow('Invalid JSON')
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should throw error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({}),
      }
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      await expect(fetchShowDetails(1)).rejects.toThrow(
        'Failed to fetch show details: 404 Not Found',
      )
    })

    it('should handle show details with all embeds', async () => {
      const mockShow = {
        id: 1,
        name: 'Test Show',
        _embedded: {
          seasons: [],
          cast: [],
          crew: [],
          images: [],
        },
      }
      const mockResponse = createMockResponse(mockShow)
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      const result = await fetchShowDetails(1)

      expect(result).toEqual(mockShow)
      expect(global.fetch).toHaveBeenCalledWith(
        `${API.BASE_URL}${API.ENDPOINTS.SHOWS}/1?embed[]=seasons&embed[]=cast&embed[]=crew&embed[]=images`,
      )
    })
  })

  describe('searchShows', () => {
    it('should search shows successfully', async () => {
      const mockSearchResults = [
        { score: 0.9, show: { id: 1, name: 'Show 1' } },
        { score: 0.8, show: { id: 2, name: 'Show 2' } },
      ]
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockSearchResults),
      }
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      const query = 'test'
      const result = await searchShows(query)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(
        `${API.BASE_URL}${API.ENDPOINTS.SEARCH_SHOWS}?q=${encodeURIComponent(query)}`,
      )
      expect(result).toEqual(mockSearchResults)
    })

    it('should throw error when search fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      }
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      await expect(searchShows('test')).rejects.toThrow('Search failed')
    })

    it('should handle empty search query', async () => {
      const mockResponse = createMockResponse([])
      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse)

      const result = await searchShows('')

      expect(result).toEqual([])
      expect(global.fetch).toHaveBeenCalledWith(
        `${API.BASE_URL}${API.ENDPOINTS.SEARCH_SHOWS}?q=`,
      )
    })
  })
})
