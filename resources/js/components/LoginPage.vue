<template>
  <AppLayout>
    <div class="flex justify-center items-center h-screen relative">
      <div class="absolute w-[570px] h-[500px] bg-green-800 reqtangle-full opacity-40 blur-3xl animate-pulse"></div>
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-10">
        <h1 class="text-3xl font-bold text-center mb-6">Login</h1>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="form.email" required placeholder="Enter your email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" v-model="form.password" required placeholder="Enter your password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <button type="submit" class="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-900 focus:outline-none ">Login</button>
        </form>
        <p class="text-center mt-4 text-sm">Don't have an account? <a href="/register" class="text-green-500 hover:underline">Register here</a></p>
      </div>
    </div>
  </AppLayout>
</template>
<script>
import loginScript from '../scripts/Login.js';
export default {
  mixins: [loginScript],
};
</script>

