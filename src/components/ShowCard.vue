<script setup lang="ts">
defineProps<{
  name?: string
  summary?: string | null
  image?: string | null
  year?: string | null
  rating?: number | null
}>()
</script>

<template>
  <div class="card">
    <img v-if="image" :src="image" :alt="`Poster for the TV show: ${name}`" />
    <div class="card-content">
      <h3 v-if="name">{{ name }}</h3>
      <p v-if="rating">Rating: {{ rating }}</p>
      <p v-if="year">Year: {{ year }}</p>
      <p v-if="summary">{{ summary }}</p>
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
  padding: 1rem;
}

.card img {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 300px;
  border-radius: $card-border-radius;
  margin-bottom: 0.5rem;
}

.card-content {
  h3 {
    margin: 0.5rem 0;
  }

  p {
    margin: 0;
  }
}
</style>
