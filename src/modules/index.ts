import type { Show } from '@/api/types'
import type { GenresMap } from '@/store/types'
import { fetchAllShows } from '@/api'
import { useStore } from '@/store'

export const showsModule = {
  async fetchShows() {
    const store = useStore()
    if (Object.keys(store.genres).length > 0) return // TODO: add check if show was updated since last fetch ???

    store.setLoading(true)
    store.setError(null)

    try {
      const shows = await fetchAllShows()
      store.setGenres(this.getGenresMap(shows))
    } catch (error) {
      store.setError(
        error instanceof Error ? error.message : 'Failed to fetch shows',
      )
    } finally {
      store.setLoading(false)
    }
  },
  getGenresMap(shows: Show[]): GenresMap {
    const genresMap: GenresMap = {}

    shows.forEach((show) => {
      show.genres.forEach((genre) => {
        if (!genresMap[genre]) genresMap[genre] = []
        genresMap[genre].push({
          id: show.id,
          name: show.name,
          image: show.image?.medium || null,
          summary: show.summary || null,
          rating: show.rating.average || null,
        })
      })
    })
    return genresMap
  },
}
