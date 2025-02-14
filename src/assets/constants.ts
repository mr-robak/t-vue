export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.tvmaze.com',
  RATE_LIMIT_DELAY: 1100,
  ENDPOINTS: {
    SHOWS: '/shows',
  },
} as const
