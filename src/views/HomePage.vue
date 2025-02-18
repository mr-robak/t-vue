<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'
import ScrollList from '@/components/ScrollList.vue'

const store = useStore()
const genresEntries = computed(() => Object.entries(store.genres))
</script>

<template>
  <section>
    <main>
      <ScrollList
        v-for="[genreName, ScrollList] in genresEntries"
        :key="genreName"
        :genre="genreName"
        :shows="ScrollList"
        navigation
      />
    </main>
  </section>
</template>

<style scoped lang="scss">
main {
  padding-top: 4rem;
}
</style>
