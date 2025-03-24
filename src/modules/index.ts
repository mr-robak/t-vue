import { streamShows } from '@/api'
import { useStore } from '@/store'
import type { Show } from '@/api/types'
import type { GenresMap, MappedShow } from '@/store/types'

export const showsModule = {
  async fetchShows() {
    const store = useStore()
    if (Object.keys(store.genres).length > 0) return

    store.setLoading(true)
    store.setError(null)

    try {
      for await (const batch of streamShows()) {
        const genreMap = this.getGenresMap(batch)

        for (const genre in genreMap) {
          store.addShowsToGenre(genre, genreMap[genre])
        }
      }
    } catch (error) {
      store.setError(
        error instanceof Error ? error.message : 'Failed to fetch shows',
      )
    } finally {
      store.setLoading(false)
    }
  },
  getGenresMap(shows: Show[]): GenresMap {
    const genresMap: { [key: string]: MappedShow[] } = {}

    shows.sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))

    shows.forEach((show) => {
      const mappedShow = {
        id: show.id,
        name: show.name,
        image: show.image?.medium || null,
        summary: show.summary || null,
        rating: show.rating.average || null,
        year: show.premiered ? show.premiered.split('-')[0] : null,
      }

      show.genres.forEach((genre) => {
        if (!genresMap[genre]) genresMap[genre] = []
        genresMap[genre].push(mappedShow)
      })
    })

    return genresMap
  },
}
