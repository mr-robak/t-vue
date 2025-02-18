<script setup lang="ts">
import { useRouter } from 'vue-router'
import { PhCaretLeft } from '@phosphor-icons/vue'

const props = defineProps<{
  to:
    | string
    | {
        name: string
        params?: Record<string, string>
        query?: Record<string, string>
      }
}>()

const router = useRouter()

const navigate = () => {
  router.push(props.to)
}
</script>

<template>
  <button class="nav-button" @click="navigate">
    <PhCaretLeft :size="32" />
  </button>
</template>

<style scoped lang="scss">
.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0.5rem;
  color: $color-text-secondary;
  min-width: 48px;
  min-height: 48px;
}
</style>
