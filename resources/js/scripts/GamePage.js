export default {
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        game: null,
        comments: [],
        loading: true,
        error: null,
      };
    },
    mounted() {
      this.fetchGameDetails();
      this.fetchComments();
    },
    methods: {
      async fetchGameDetails() {
        try {
          const response = await fetch(`/api/games/${this.id}`);
          if (response.ok) {
            this.game = await response.json();
          } else {
            this.error = "Failed to fetch game details.";
          }
        } catch (error) {
          this.error = "Error fetching game details.";
          console.error("Error fetching game details:", error);
        } finally {
          this.loading = false;
        }
      },
      async fetchComments() {
        try {
          const response = await fetch(`/api/games/${this.id}/comments`);
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