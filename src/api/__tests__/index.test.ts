import { fetchAllShows } from '../index'
import * as helpers from '@/utilities/helpers'
import { API } from '@/assets/constants'
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest'

vi.mock('@/utilities/helpers', () => ({
  sleep: vi.fn(),
}))

describe('API', () => {
  const mockShows = [
    { id: 1, name: 'Show 1' },
    { id: 2, name: 'Show 2' },
  ]

  const createMockResponse = (data: any, status = 200) => ({
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
    const setupFetchMock = (...responses: any[]) => {
      const mockFetch = vi.fn()
      responses.forEach((response) => {
        mockFetch.mockImplementationOnce(() => Promise.resolve(response))
      })
      global.fetch = mockFetch
    }

    it('should fetch all shows successfully', async () => {
      const responses = [
        createMockResponse(mockShows),
        createMockResponse(mockShows),
        createMockResponse([]),
      ]
      setupFetchMock(...responses)

      const result = await fetchAllShows()

      expect(result).toEqual([...mockShows, ...mockShows])
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should handle rate limiting', async () => {
      const responses = [
        createMockResponse(null, 429),
        createMockResponse(mockShows),
        createMockResponse([]),
      ]
      setupFetchMock(...responses)

      await fetchAllShows()

      expect(helpers.sleep).toHaveBeenCalledWith(API.RATE_LIMIT_DELAY)
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should handle fetch errors', async () => {
      const errorMessage = 'Network error'
      global.fetch = vi.fn().mockRejectedValueOnce(new Error(errorMessage))

      await expect(fetchAllShows()).rejects.toThrow(
        `Failed to fetch shows: Error: ${errorMessage}`,
      )
    })

    it('should stop fetching when empty response is received', async () => {
      setupFetchMock(createMockResponse([]))

      const result = await fetchAllShows()

      expect(result).toEqual([])
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })
})
