<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  id?: number
  name?: string
  summary?: string | null
  image?: string | null
  year?: string | null
  rating?: number | null
}>()

const isImageLoaded = ref(false)
const noContent = Object.values(props).every((prop) => !prop)

const onImageLoad = () => {
  isImageLoaded.value = true
}
</script>

<template>
  <div
    class="card"
    :class="{
      'is-empty': noContent,
      'has-image': image,
      'is-loading': image && !isImageLoaded,
    }"
  >
    <div class="card-wrapper">
      <div v-if="image" class="image-container">
        <img
          :src="image"
          :alt="`Poster for the TV show: ${name}`"
          :key="`show-poster-${id}`"
          @load="onImageLoad"
          :style="{ opacity: isImageLoaded ? 1 : 0 }"
        />
      </div>

      <div class="card-content">
        <div class="top-content">
          <div></div>
          <div v-if="rating" class="rating-container">
            <img
              src="@/assets/images/tmdb-logo.svg"
              alt="TMDB Logo"
              class="tmdb-logo"
              :key="`tmdb-logo-${id}`"
            />
            <span class="rating">{{ Math.round(rating * 10) }}%</span>
          </div>
        </div>

        <div class="bottom-content">
          <p class="year">{{ year }}</p>
          <h2 class="title">{{ name }}</h2>
          <p class="summary">{{ summary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
@use '@/assets/styles/_mixins' as *;

.card {
  display: block;
  position: relative;
  width: 100%;
  background-color: $card-bg-color;
  border: $card-border-width solid $color-border;
  border-radius: $card-border-radius;
  color: $color-text-primary;
  aspect-ratio: 2 / 3;
  transition: all 0.3s ease;

  &.is-empty {
    @include skeleton-loading;
    border: none;
  }

  &.is-loading {
    @include skeleton-loading;
  }
}

.card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

.image-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: $card-border-radius;
  overflow: hidden;
}

.image-container img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.card-content {
  display: flex;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: $card-border-radius;
  opacity: 0;
  transition: opacity 0.3s ease;
  user-select: none;

  * {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.274));
  }
}

.card.has-image {
  .card-content {
    opacity: 0;
  }
  &:hover .card-content {
    opacity: 1;
  }
}

.card:not(.has-image) .card-content {
  opacity: 1;
}

.top-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rating-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tmdb-logo {
    height: $font-size-xsm;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));

    @include phone {
      font-size: 1rem;
    }
  }

  .rating {
    font-size: $font-size-xsm;
    font-weight: $font-weight-bold;

    @include phone {
      font-size: 0.65rem;
    }
  }
}

.bottom-content {
  .year {
    margin-bottom: 0.5rem;
    font-size: $font-size-base;
    font-weight: $font-weight-regular;

    @include phone {
      margin-bottom: 0.25rem;
      font-size: $font-size-sm;
    }
  }

  .title {
    display: -webkit-box;
    margin: 0 0 0.5rem;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    line-height: 1.2;
    @include text-clamp(3);

    @include phone {
      margin-bottom: 0.25rem;
      font-size: $font-size-base;
    }
  }

  .summary {
    display: -webkit-box;
    margin: 0;
    font-size: $font-size-xsm;
    font-weight: $font-weight-light;
    line-height: 1.4;
    @include text-clamp(5);

    @include phone {
      font-size: $font-size-micro;
      @include text-clamp(4);
    }
  }
}
</style>
