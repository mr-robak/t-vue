<script setup lang="ts">
import type { Show } from '@/api/types'
import { fetchAllShows } from '@/api/api'
import { onMounted, ref } from 'vue'

const shows = ref<Show[]>([])

onMounted(async () => {
  shows.value = await fetchAllShows()
})
</script>

<template>
  <div>
    <h1>TVue Dashboard</h1>
    <div v-if="shows.length">
      <p>{{ shows.length }}</p>
      <ul>
        <li v-for="show in shows" :key="show.id">
          {{ show.name }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped></style>
