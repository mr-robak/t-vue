<template>
  <div class="not-found">
    <img src="@/assets/images/404.gif" alt="404 Error" class="error-gif" />
    <h1>This Is Not TV Show You Are Looking For...</h1>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style lang="scss">
@use '@/assets/styles/_variables.scss';

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
}

h1 {
  margin-top: 2rem;
  font-size: $font-size-xlg;
  color: rgba(58, 150, 212, 0.58);
}

.error-gif {
  display: block;
  width: 100%;
  max-width: 600px;
  height: auto;
  margin: 0 auto;
  border: $card-border-width solid $color-border;
  border-radius: $card-border-radius;
  object-fit: cover;
  background-color: $card-bg-color;

  @media (max-width: 768px) {
    max-width: 90%;
  }

  @media (max-width: 480px) {
    max-width: 95%;
  }
}
</style>
