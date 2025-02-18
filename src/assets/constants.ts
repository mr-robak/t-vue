export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.tvmaze.com',
  RATE_LIMIT_DELAY: 1100,
  MAX_RETRIES: 3,
  ENDPOINTS: {
    SHOWS: '/shows',
    SEARCH_SHOWS: '/search/shows',
  },
} as const
