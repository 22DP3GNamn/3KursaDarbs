<script setup>
import GameCard from '../components/GameCard.vue'

const games = [
  { title: 'Game 1', description: 'Description for Game 1', image: 'path/to/image1.jpg' },
  { title: 'Game 2', description: 'Description for Game 2', image: 'path/to/image2.jpg' },
  { title: 'Game 3', description: 'Description for Game 3', image: 'path/to/image3.jpg' },
  // Add more games as needed
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
main {
  padding: 20px;
}

.games-section {
  margin-top: 40px;
}

.games-section h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
</style>