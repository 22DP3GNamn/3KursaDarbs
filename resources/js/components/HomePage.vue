<template>
  <AppLayout>
    <div class="pt-30 p-10 min-h-screen">
      <h1 class="text-4xl font-bold text-center text-white mb-10">Upcoming Games</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="game in games"
          :key="game.id"
          @click="redirectToGame(game.id)"
          class="block relative bg-gradient-to-br from-gray-800 to-gray-600 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer"
        >
          <div class="p-4">
            <h2 class="text-xl font-bold text-white mb-2">{{ game.name }}</h2>
            <p class="text-gray-300 mb-4">{{ game.description }}</p>
            <p class="text-green-400 font-semibold">Status: {{ game.status }}</p>
            <p class="text-blue-400 font-semibold">Category: {{ game.category?.name || 'N/A' }}</p>
          </div>
        </div>
      </div>
      <div v-if="games.length === 0" class="text-center text-gray-400 mt-10">
        No games found in the database.
      </div>
    </div>
  </AppLayout>
</template>

<script>
import HomePageScript from '../scripts/HomePage.js';
export default {
  mixins: [HomePageScript],
  methods: {
    redirectToGame(gameId) {
      window.location.href = `/game/${gameId}`;
    },
  },
};
</script>