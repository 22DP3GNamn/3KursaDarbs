<script setup>
import GameCard from '../components/GameCard.vue'
import image1 from '../assets/icons/images.jpeg'

const games = [
  { title: 'Game 1', description: 'Description for Game 1', image: image1 },
  { title: 'Game 2', description: 'Description for Game 2', image: image1 },
  { title: 'Game 3', description: 'Description for Game 3', image: image1 },
]
</script>

<template>
  <main>
    <section class="games-section">
      <h2>Featured Games</h2>
      <div class="games-grid">
        <GameCard v-for="game in games" :key="game.title" :game="game" />
      </div>
    </section>
  </main>
</template>

<style scoped>
@import '../assets/main.css';
</style>