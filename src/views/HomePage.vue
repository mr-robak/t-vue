<script setup lang="ts">
import { onMounted } from 'vue'
import { showsModule } from '@/modules/index'
import { useStore } from '@/store'

const store = useStore()

onMounted(async () => {
  await showsModule.fetchShows()
})
</script>

<template>
  <div>
    <div v-if="store.isLoading">Loading shows...</div>
    <div v-else-if="store.error">{{ store.error }}</div>
    <div v-else>
      <h1>TV Shows</h1>
      <div>
        <p>Total genres: {{ Object.keys(store.genres).length }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
