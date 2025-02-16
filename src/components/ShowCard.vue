<script setup lang="ts">
const props = defineProps<{
  name?: string
  summary?: string | null
  image?: string | null
  year?: string | null
  rating?: number | null
}>()

const noProps = Object.values(props).every((prop) => !prop)
const hasData = !noProps
</script>

<template>
  <div class="card" :class="{ 'is-loading': noProps }">
    <div class="card-wrapper">
      <div v-if="image" class="image-container">
        <img :src="image" :alt="`Poster for the TV show: ${name}`" />
      </div>

      <div v-if="hasData" class="card-content">
        <h3>{{ name }}</h3>
        <p>Rating: {{ rating }}</p>
        <p>Year: {{ year }}</p>
        <p>{{ summary }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 200px;
  min-width: 200px;
  border-radius: $card-border-radius;
  background-color: $card-bg-color;
  color: #ffffff;
  flex: 0 0 auto;

  &.is-loading {
    background: linear-gradient(
      100deg,
      $card-bg-color 0%,
      $card-bg-color 40%,
      lighten($card-bg-color, 5%) 50%,
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

.image-container,
.image-placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: $card-border-radius;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.image-placeholder {
  background-color: lighten($card-bg-color, 5%);
}

.card-content {
  position: absolute;
  inset: 0;
  padding: 1rem;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  border-radius: $card-border-radius;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  h3 {
    margin: 0.5rem 0;
  }

  p {
    margin: 0.25rem 0;
  }
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
</style>
