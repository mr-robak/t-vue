<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const props = defineProps<{ genre: string }>()

const store = useStore()

const genreShows = computed(() => store.showsByGenre(props.genre))
</script>

<template>
  <div>
    <h2>Shows in "{{ props.genre }}"</h2>
    <div v-if="genreShows.length">
      <div>
        <ul>
          <li v-for="show in genreShows" :key="show.id">
            <img
              v-if="show.image && show.image"
              :src="show.image"
              :alt="show.name"
            />
            <div>
              <h3>{{ show.name }}</h3>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>No shows available for this genre.</p>
    </div>
  </div>
</template>

<style scoped></style>
