import type { Show } from '@/api/types'
import type { GenresMap, MappedShow } from '@/store/types'
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
      const genres = this.getGenresMap(shows)

      for (const genre in genres) {
        genres[genre] = this.sortByRating(genres[genre], 'desc')
      }

      store.setGenres(genres)
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

    // TODO: improve by sorting in line here???
    shows.forEach((show) => {
      show.genres.forEach((genre) => {
        if (!genresMap[genre]) genresMap[genre] = []
        genresMap[genre].push({
          id: show.id,
          name: show.name,
          image: show.image?.medium || null,
          summary: show.summary || null,
          rating: show.rating.average || null,
          year: show.premiered ? show.premiered.split('-')[0] : null,
        })
      })
    })
    return genresMap
  },
  sortByRating(
    shows: MappedShow[],
    direction: 'asc' | 'desc' = 'desc',
  ): MappedShow[] {
    return shows.sort((a, b) => {
      return direction === 'asc'
        ? (a.rating || 0) - (b.rating || 0)
        : (b.rating || 0) - (a.rating || 0)
    })
  },
}
