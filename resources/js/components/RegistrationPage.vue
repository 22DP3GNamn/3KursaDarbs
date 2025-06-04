<template>
  <AppLayout>
    <div class="flex justify-center items-center h-screen relative">
      <div class="absolute w-[600px] h-[650px] bg-green-800 reqtangle-full opacity-40 blur-3xl animate-pulse"></div>
      <div class="bg-gray-300 p-6 rounded-lg shadow-lg w-full max-w-md z-10">
        <h1 class="text-3xl font-bold text-center mb-6">Register</h1>
        <form @submit.prevent="register">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" v-model="form.username" required placeholder="Enter your username" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="form.email" required placeholder="Enter your email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" v-model="form.password" required placeholder="Enter your password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <div class="mb-4">
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" id="confirm-password" v-model="form.confirmPassword" required placeholder="Confirm your password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
          </div>
          <button type="submit" class="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-900 focus:outline-none">Register</button>
        </form>
        <p class="text-center mt-4 text-sm">Already have an account? <a href="/login" class="text-green-500 hover:underline">Login here</a></p>
      </div>
    </div>
  </AppLayout>
</template>
<script>
import RegJS from '../scripts/Register.js';

export default {
  mixins: [RegJS],
};
</script>