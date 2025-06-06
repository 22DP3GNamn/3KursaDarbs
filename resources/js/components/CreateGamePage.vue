<template>
  <AppLayout>
    <div class="min-h-screen flex items-center justify-center">
      <div class="w-full max-w-lg mx-auto p-8 sm:p-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md border border-white/30">
        <h1 class="text-3xl font-extrabold mb-8 text-center text-green-700 drop-shadow">Create Game</h1>
        <form @submit.prevent="submitGame" class="flex flex-col gap-5">
          <input
            v-model="form.name"
            type="text"
            placeholder="Name"
            required
            class="border border-green-300 px-4 py-2 rounded-lg bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <textarea
            v-model="form.description"
            placeholder="Description"
            class="border border-green-300 px-4 py-2 rounded-lg bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
          ></textarea>
          <select
            v-model="form.status"
            required
            class="border border-green-300 px-4 py-2 rounded-lg bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            v-model="form.category_id"
            required
            class="border border-green-300 px-4 py-2 rounded-lg bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option disabled value="">Select Category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <button
            type="submit"
            class="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition"
          >
            Create Game
          </button>
        </form>
        <button
          @click="fillTable"
          class="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-2 rounded-lg font-semibold shadow hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition"
        >
          Fill Table With 10 Random Games
        </button>
        <div v-if="message" class="mt-6 text-center text-green-700 font-semibold">{{ message }}</div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        status: "active",
        category_id: "",
      },
      categories: [],
      message: "",
    };
  },
  mounted() {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        this.categories = data;
        if (data.length > 0) this.form.category_id = data[0].id;
      });
  },
  methods: {
    async submitGame() {
      this.message = "";
      const res = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
        body: JSON.stringify(this.form),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (res.ok) {
        this.message = data.message || "Game created!";
        this.form = { name: "", description: "", status: "active", category_id: this.categories[0]?.id || "" };
      } else if (res.status === 422 && data.errors) {
        this.message = Object.values(data.errors).flat()[0];
      } else {
        this.message = data.message || "Failed to create game.";
      }
    },
    async fillTable() {
      this.message = "Filling table...";
      for (let i = 0; i < 10; i++) {
        const game = {
          name: "Game " + Math.floor(Math.random() * 10000),
          description: "Random game description.",
          status: Math.random() > 0.5 ? "active" : "inactive",
          category_id: this.categories[0]?.id || 1,
        };
        await fetch("/api/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
          },
          body: JSON.stringify(game),
        });
      }
      this.message = "10 random games created!";
    },
  },
};
</script>
