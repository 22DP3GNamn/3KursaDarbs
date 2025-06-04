<template>
  <AppLayout>
    <div :class="['pt-30 p-10 bg-black min-h-screen transition-all duration-1000', { 'pl-20': isMenuVisible }]">
      <h1 class="text-4xl font-bold text-center text-white mb-10">Upcoming Games</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div v-for="game in games" :key="game.id" class="relative">
          <div class="relative bg-white shadow-lg rounded-lg overflow-hidden">
            <img :src="game.image" alt="Game Image" class="w-full h-48 object-cover">
            <div class="p-4">
              <h2 class="text-xl font-bold mb-2">{{ game.title }}</h2>
              <p class="text-gray-600 mb-4">{{ game.description }}</p>
              <p class="text-green-500 font-semibold">Release Date: {{ game.releaseDate }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="h-[200vw]"></div>
    </div>
  </AppLayout>
</template>

<script>
  import Navigation from '../scripts/Navigation.js';
  export default {
    data() {
      return {
        games: [
          {
            id: 1,
            title: "Game 1",
            description: "An exciting upcoming game.",
            releaseDate: "2023-12-01",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 2,
            title: "Game 2",
            description: "Another thrilling adventure.",
            releaseDate: "2024-01-15",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 3,
            title: "Game 3",
            description: "A game you don't want to miss.",
            releaseDate: "2024-03-10",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 4,
            title: "Game 3",
            description: "A game you don't want to miss.",
            releaseDate: "2024-03-10",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 5,
            title: "Game 3",
            description: "A game you don't want to miss.",
            releaseDate: "2024-03-10",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 6,
            title: "Game 3",
            description: "A game you don't want to miss.",
            releaseDate: "2024-03-10",
            image: "https://via.placeholder.com/300x200",
          },
          {
            id: 7,
            title: "Game 3",
            description: "A game you don't want to miss.",
            releaseDate: "2024-03-10",
            image: "https://via.placeholder.com/300x200",
          },
        ],
        isMenuVisible: false,
      };
    },
    mounted() {
      // Pass a callback to handle scroll visibility
      Navigation((scrollPosition) => {
        this.isMenuVisible = scrollPosition > 100;
      });
    },
  };
</script>