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
  // TODO: catch errors
})
</script>

<template>
  <section>
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
