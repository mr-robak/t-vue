<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PhMagnifyingGlass, PhXCircle } from '@phosphor-icons/vue'

const query = ref('')
const router = useRouter()
const route = useRoute()

const doSearch = () => {
  if (query.value) {
    router.push({ name: 'SearchShows', query: { q: query.value } })
  }
}

watchEffect(() => {
  if (route.name !== 'SearchShows') {
    query.value = ''
  }
})
</script>

<template>
  <div class="search-bar">
    <div class="search-wrapper">
      <div class="icon left-icon">
        <PhMagnifyingGlass size="20" />
      </div>
      <input
        v-model="query"
        @keyup.enter="doSearch"
        type="text"
        class="search-input"
        placeholder="Search TV Shows..."
      />
      <div v-if="query" class="icon clear-icon" @click="query = ''">
        <PhXCircle size="20" color="var(--color-text-secondary)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  width: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.search-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  background: #233041;
  border: 1px solid $color-border;
  border-radius: 9999px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 0 0.5rem;
  margin-top: 0.15rem;
  background: transparent;
  border: none;
  color: $color-text-primary;
  caret-color: $color-text-primary;
  font-size: $font-size-base;
  outline: none;

  &:focus {
    box-shadow: none;
  }
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.75rem;
  margin-top: 0.15rem;
}
</style>
