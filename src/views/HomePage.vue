<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { showsModule } from '@/modules/index'
import { useStore } from '@/store'
import ShowsList from '@/components/ShowsList.vue'

const store = useStore()

const genresEntries = computed(() => Object.entries(store.genres))

// TODO: implement loader
onMounted(async () => {
  await showsModule.fetchShows()
})
</script>

<template>
  <section>
    <header>
      <h1>TV Shows</h1>
    </header>
    <main>
      <ShowsList
        v-for="[genreName, showsList] in genresEntries"
        :key="genreName"
        :genre="genreName"
        :shows="showsList"
      />
    </main>
  </section>
</template>

<style scoped lang="scss"></style>
