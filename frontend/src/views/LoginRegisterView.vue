<template>
    <div class="login-view">
      <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const username = ref('')
  const password = ref('')
  const router = useRouter()
  
  function handleLogin() {
    // Handle login logic here
    console.log('Username:', username.value)
    console.log('Password:', password.value)
    // Mock login success
    isLoggedIn.value = true
    router.push('/')
  }
  </script>
  
  <style scoped>
  @import '../assets/login.css';
  </style>