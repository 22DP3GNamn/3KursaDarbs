<template>
  <AppLayout>
    <div class="container mx-auto p-5">
      <div v-if="loading" class="text-center">
        <p>Loading game details...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-500">
        <p>Error loading game details: {{ error }}</p>
      </div>
      <div v-else>
        <h1 class="text-3xl font-bold mb-4">{{ game.name }}</h1>
        <p class="text-gray-700 mb-6">{{ game.description }}</p>
        <div class="flex justify-between items-center">
          <button @click="startGame" class="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
            Start Game
          </button>
          <p class="text-gray-600">Category: {{ game.category?.name || 'N/A' }}</p> <!-- Ensure proper syntax -->
        </div>
        <div class="mt-6">
          <h2 class="text-2xl font-bold mb-4">Comments</h2>
          <div v-if="comments.length === 0" class="text-gray-500">
            No comments yet. Be the first to comment!
          </div>
          <ul>
            <li v-for="comment in comments" :key="comment.id" class="mb-4">
              <p class="font-bold">{{ comment.user.username }}</p>
              <p class="text-gray-700">{{ comment.content }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import GamePageScript from '../scripts/GamePage.js';
export default {
  mixins: [GamePageScript],
};
</script>