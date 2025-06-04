<template>
  <AppLayout>
    <div class="container mx-auto p-5">
      <div v-if="loading" class="text-center">
        <p>Loading game details...</p>
      </div>
      <div v-else>
        <h1 class="text-3xl font-bold mb-4">{{ game.name }}</h1>
        <p class="text-gray-700 mb-6">{{ game.description }}</p>
        <div class="flex justify-between items-center">
          <button @click="startGame" class="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
            Start Game
          </button>
          <p class="text-gray-600">Category: {{ game.category.name }}</p>
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
export default {
  props: {
    gameId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      game: null,
      comments: [],
      loading: true,
    };
  },
  mounted() {
    this.fetchGameDetails();
    this.fetchComments();
  },
  methods: {
    async fetchGameDetails() {
      try {
        const response = await fetch(`/api/games/${this.gameId}`);
        if (response.ok) {
          this.game = await response.json();
        } else {
          console.error("Failed to fetch game details");
        }
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchComments() {
      try {
        const response = await fetch(`/api/games/${this.gameId}/comments`);
        if (response.ok) {
          this.comments = await response.json();
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    startGame() {
      alert("Game started!");
    },
  },
};
</script>