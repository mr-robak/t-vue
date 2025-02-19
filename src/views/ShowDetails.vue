<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchShowDetails } from '@/api'
import { clearHTMLTags, formatYear } from '@/utilities/helpers'
import BackButton from '@/components/BackButton.vue'
import CardItem from '@/components/CardItem.vue'
import AvatarImage from '@/components/AvatarImage.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { ShowDetails } from '../api/types'

const route = useRoute()

const show = ref<ShowDetails | null>(null)

interface ShowImage {
  type: string
  resolutions?: {
    original?: {
      url: string
    }
  }
}

interface CastMember {
  person: {
    id: number
    name: string
    image?: {
      medium?: string
    } | null
  }
  character: {
    name: string
  }
}

interface MappedCastMember {
  id: number
  name: string
  image: string | null
  character: string
}

const backgroundImage = computed(() => {
  if (!show.value?._embedded?.images) return ''

  const backgroundImg = show.value._embedded.images.find(
    (img: ShowImage) => img.type === 'background' || img.type === 'banner',
  )
  return (
    backgroundImg?.resolutions?.original?.url ||
    show.value.image?.original ||
    ''
  )
})

const formattedAirDate = computed(() => {
  if (!show.value?.premiered) return ''
  return formatYear(show.value.premiered)
})

const showMeta = computed(() => {
  if (!show.value) return []

  const meta = []

  if (show.value.runtime) {
    meta.push(`Avg. ${show.value.runtime} min`)
  }

  if (show.value.genres?.length) {
    meta.push(show.value.genres.join(', '))
  }

  return meta
})

const mappedCast = computed<MappedCastMember[]>(() => {
  if (!show.value?._embedded?.cast) return []

  return show.value._embedded.cast.slice(0, 10).map(
    (castMember: CastMember): MappedCastMember => ({
      id: castMember.person.id,
      name: castMember.person.name,
      image: castMember.person.image?.medium || null,
      character: castMember.character.name,
    }),
  )
})

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const data = await fetchShowDetails(id)
    show.value = data
  } catch (err: unknown) {
    console.warn('Failed to fetch show details:', err)
  }
})
</script>

<template>
  <section v-if="show">
    <div
      class="show-details"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <BackButton />
      <div class="show-content">
        <div class="show-header">
          <img
            v-if="show.image?.medium"
            :src="show.image.medium"
            :alt="`${show.name} poster`"
            class="show-image"
          />
          <div class="show-header-content">
            <div class="header-main-info">
              <h1 class="show-title">
                {{ show.name }}
                <span v-if="formattedAirDate" class="air-date">
                  ({{ formattedAirDate }})
                </span>
              </h1>
              <div v-if="show.rating" class="rating-container">
                <img
                  src="@/assets/images/tmdb-logo.svg"
                  alt="TMDB Logo"
                  class="tmdb-logo"
                />
                <span class="rating"
                  >{{ Math.round((show.rating?.average || 0) * 10) }}%</span
                >
              </div>
            </div>
            <div class="meta-info">
              <template v-for="(item, index) in showMeta" :key="index">
                <span>{{ item }}</span>
                <span v-if="index < showMeta.length - 1" class="separator"
                  >|</span
                >
              </template>
            </div>
          </div>
        </div>
        <div class="overview-section">
          <h2 class="overview-title">Overview</h2>
          <p class="overview-text">
            {{ clearHTMLTags(show.summary) || 'No overview available.' }}
          </p>
        </div>
        <div class="seasons-section">
          <h2 class="seasons-title">Seasons</h2>
          <div class="seasons-grid">
            <CardItem
              v-for="season in show._embedded?.seasons"
              :key="season.id"
              :id="season.id"
              :name="season.name || `Season ${season.number}`"
              :summary="clearHTMLTags(season.summary)"
              :image="season.image?.medium"
              :year="formatYear(season.premiereDate)"
            />
          </div>
        </div>
        <div class="cast-section">
          <h2 class="section-title">Cast</h2>
          <div class="cast-grid">
            <AvatarImage
              v-for="actor in mappedCast"
              :key="actor.id"
              :image="actor.image"
              :name="actor.name"
              :subtext="actor.character"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section v-else>
    <LoadingSpinner />
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_mixins' as *;
@use '@/assets/styles/_variables' as *;

.show-details {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-size: clamp(100%, calc(100% + (1200px - 100vw) * 0.02), 115%);
  background-position: top center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  padding: 4.5rem 1rem 1rem;
  background-color: $color-background;
  transition: background-size 0.5s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba($color-background, 0.4) 0%,
      rgba($color-background, 0.8) 30%,
      rgba($color-background, 1) 100%
    );
    z-index: 1;
  }

  .back-button,
  .show-header {
    position: relative;
    z-index: 2;
  }

  .show-content {
    position: relative;
    z-index: 2;
    padding: 1.5rem;
    margin-top: 1rem;
    width: 100%;

    @include phone {
      padding: 1rem;
    }

    @include desktop {
      max-width: 1200px;
      margin: 0 auto;
    }
  }

  .overview-section,
  .seasons-section,
  .cast-section {
    margin-top: 2rem;

    @include phone {
      margin-top: 1.5rem;
    }
  }

  .overview-title,
  .seasons-title,
  .section-title {
    color: $color-text-primary;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    margin: 0 0 1rem;

    @include phone {
      text-align: center;
    }
  }

  .overview-text {
    color: $color-text-secondary;
    font-size: $font-size-base;
    line-height: 1.5;
    margin: 0;
  }

  .seasons-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));

    @include tablet {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    @include desktop {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }

  .cast-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

    @include phone {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }

  .show-header {
    display: flex;
    gap: 2rem;
    align-items: flex-end;

    @include phone {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .show-image {
      width: 250px;
      height: auto;
      border: $card-border-width solid $color-border;
      border-radius: $card-border-radius;

      @include phone {
        width: 180px;
        margin-bottom: 1rem;
      }
    }

    .show-header-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      @include phone {
        padding-bottom: 0;
        width: 100%;
      }

      .header-main-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;

        @include phone {
          flex-direction: column;
          align-items: flex-start;
        }

        .show-title {
          margin: 0;
        }

        .rating-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          .tmdb-logo {
            height: $font-size-xsm;
          }

          .rating {
            font-size: $font-size-base;
            font-weight: $font-weight-bold;
          }
        }
      }

      .show-title {
        color: $color-text-primary;
        font-size: $font-size-xlg;
        font-weight: $font-weight-bold;
        margin: 0;
        line-height: 1.2;

        @include phone {
          font-size: $font-size-lg;
          text-align: center;
        }

        .air-date {
          color: $color-text-secondary;
          font-size: $font-size-base;
          font-weight: $font-weight-regular;
          margin-left: 0.5rem;

          @include phone {
            display: block;
            margin-left: 0;
            margin-top: 0.25rem;
          }
        }
      }

      .meta-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: $color-text-secondary;
        font-size: $font-size-base;

        .separator {
          color: $color-border;
          margin: 0 0.25rem;
        }

        @include phone {
          justify-content: center;
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>
