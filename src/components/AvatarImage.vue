<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  image: string | null
  name: string
  subtext?: string
}>()
</script>

<template>
  <div class="avatar">
    <div class="avatar-image">
      <img v-if="image" :src="image" :alt="name" />
    </div>
    <div class="avatar-info">
      <span class="name">{{ name }} </span>
      <span v-if="subtext" class="subtext"> {{ subtext }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/_mixins' as *;
@use '@/assets/styles/_variables' as *;

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  .avatar-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    background: rgba($card-bg-color, 0.5);
    border: 2px solid rgba($color-text-secondary, 0.1);

    @include phone {
      width: 80px;
      height: 80px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .avatar-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.25rem;

    .name {
      color: $color-text-primary;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
    }

    .subtext {
      color: $color-text-secondary;
      font-size: $font-size-sm;
    }
  }
}
</style>
