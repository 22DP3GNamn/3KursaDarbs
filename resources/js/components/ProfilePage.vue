<template>
  <AppLayout>
    <div class="mt-100 profile-page mx-auto p-8 border border-gray-300 rounded-lg bg-gray-50 shadow-lg w-full max-w-lg">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Profile</h1>
      <div class="flex justify-center mb-6">
        <img :src="profileImage" alt="Profile Image" class="profile-image rounded-full border-4 border-gray-300 shadow-md w-32 h-32" />
      </div>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="form-group">
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" v-model="form.username" id="username" class="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="form.email" id="email" class="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div class="form-group">
          <label for="password" class="block text-sm font-medium text-gray-700">New Password (optional)</label>
          <input type="password" v-model="form.password" id="password" class="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="form-group">
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input type="password" v-model="form.password_confirmation" id="password_confirmation" class="form-control mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" class="btn btn-primary w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Update Profile
        </button>
      </form>
      <button @click="logout" class="btn btn-secondary w-full py-2 px-4 mt-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
        Logout
      </button>
    </div>
  </AppLayout>
</template>

<script scoped>
import ProfilePageScript from '../scripts/ProfilePage.js'; // Ensure this path is correct
export default {
  mixins: [ProfilePageScript],
};
</script>