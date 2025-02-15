import { fetchAllShows } from '@/api'
import { useStore } from '@/store'

export const showsModule = {
  async fetchShows() {
    const store = useStore()
    if (store.shows.length > 0) return

    store.setLoading(true)
    store.setError(null)

    try {
      const shows = await fetchAllShows()
      store.setShows(shows)
    } catch (error) {
      store.setError(
        error instanceof Error ? error.message : 'Failed to fetch shows',
      )
    } finally {
      store.setLoading(false)
    }
  },
}
