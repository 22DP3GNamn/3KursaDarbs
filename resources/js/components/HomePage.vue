<template>
  <AppLayout>
    <div :class="['pt-30 p-10 min-h-screen transition-all duration-1000', { 'pl-20': isMenuVisible }]">
      <h1 class="text-4xl font-bold text-center text-white mb-10">Upcoming Games</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div v-for="game in games" :key="game.id" class="relative">
          <div class="relative bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-4">
              <h2 class="text-xl font-bold mb-2">{{ game.name }}</h2>
              <p class="text-gray-600 mb-4">{{ game.description }}</p>
              <p class="text-green-500 font-semibold">Status: {{ game.status }}</p>
              <p class="text-blue-500 font-semibold">Category: {{ game.category?.name || 'N/A' }}</p>
            </div>
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
  import Navigation from '../scripts/Navigation.js';
  export default {
    data() {
      return {
        games: [],
        isMenuVisible: false,
      };
    },
    mounted() {
      // Fetch games from backend
      fetch('/api/games')
        .then(res => res.json())
        .then(data => {
          this.games = data;
        });
      // Pass a callback to handle scroll visibility
      Navigation((scrollPosition) => {
        this.isMenuVisible = scrollPosition > 100;
      });
    },
  };
</script>