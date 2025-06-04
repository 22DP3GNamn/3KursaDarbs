<template>
  <AppLayout>
      <div class=" mx-auto mt-50 p-5 border border-gray-500 rounded-lg bg-white w-2/5">
        <div class=" text-center">
          <h1 class="text-2xl font-bold mb-4">Profile</h1>
          <img class=" w-24 h-24 mx-auto rounded-full" :src="profileImage" alt="Profile Image">
          <div v-if="user" class="mt-4">
            <p class="text-lg font-medium">Welcome, {{ user.username }}!</p>
            <p class="text-gray-600">Email: {{ user.email }}</p>
            <form method="POST" action="/logout">
              <input type="hidden" name="_token" :value="csrfToken" />
              <button type="submit" class="bg-red-600 border-3 rounded-md py-1 px-3 mt-3">Logout</button>
            </form>
          </div>
        </div>
      </div>
  </AppLayout>
</template>
<script scoped>
export default {
  props: {
    user: {
      type: Object,
      required: false,
      default: null,
    },
    profileImage: {
      type: String,
      required: true,
    },
  },
  computed: {
    csrfToken() {
      return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    },
  },
};
</script>
