<template>
  <div class="game-card">
    <img :src="game.image" :alt="game.title" class="game-image" />
    <div class="game-info">
      <h3>{{ game.title }}</h3>
      <p>{{ game.description }}</p>
      <button class="play-button">Play</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',
  props: {
    game: {
      type: Object,
      required: true
    }
  }
}
</script>
  
  
<style scoped>
</style>