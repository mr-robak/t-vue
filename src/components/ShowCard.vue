<script setup lang="ts">
const props = defineProps<{
  name?: string
  summary?: string | null
  image?: string | null
  year?: string | null
  rating?: number | null
}>()

const noContent = Object.values(props).every((prop) => !prop)
const ratingPercentage = props.rating ? Math.round(props.rating * 10) : null
</script>

<template>
  <div class="card" :class="{ 'is-empty': noContent, 'has-image': image }">
    <div class="card-wrapper">
      <div v-if="image" class="image-container">
        <img :src="image" :alt="`Poster for the TV show: ${name}`" />
      </div>

      <div class="card-content">
        <div class="top-content">
          <div></div>
          <div v-if="rating" class="rating-container">
            <img
              src="@/assets/images/tmdb-logo.svg"
              alt="TMDB Logo"
              class="tmdb-logo"
            />
            <span class="rating">{{ ratingPercentage }}%</span>
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

.card {
  display: block;
  position: relative;
  width: 200px;
  min-width: 200px;
  background-color: $card-bg-color;
  border: $card-border-width solid $color-border;
  border-radius: $card-border-radius;
  color: $color-text-primary;
  transition: transform 0.3s ease;

  &:not(.is-empty):hover {
    transform: scale(1.05);
    z-index: 1;
  }

  &.is-empty {
    background: linear-gradient(
      100deg,
      $card-bg-color 0%,
      $card-bg-color 40%,
      color.scale($card-bg-color, $lightness: 5%) 50%,
      $card-bg-color 60%,
      $card-bg-color 100%
    );
    background-size: 200% 100%;
    background-position-x: 180%;
    animation: shine 1.5s linear infinite;
  }
}

.card-wrapper {
  position: relative;
  height: 300px;
}

.image-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: $card-border-radius;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
}

.card-content {
  display: flex;
  position: absolute;
  inset: 0;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(19, 41, 66, 0.658);
  border-radius: $card-border-radius;
  opacity: 0;
  transition: opacity 0.3s ease;
  user-select: none;

  * {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.274));
  }
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
    width: auto;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.37));
  }

  .rating {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
  }
}

.bottom-content {
  .year {
    margin-bottom: 0.5rem;
    font-size: $font-size-base;
    font-weight: $font-weight-regular;
  }

  .title {
    display: -webkit-box;
    margin: 0 0 0.5rem;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    line-height: 1.2;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .summary {
    display: -webkit-box;
    margin: 0;
    font-size: $font-size-xsm;
    font-weight: $font-weight-light;
    line-height: 1.4;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>
