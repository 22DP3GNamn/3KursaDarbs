<template>
    <div class="register-view">
      <div class="register-container">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const username = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  
  function handleRegister() {
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match')
      return
    }
    console.log('Username:', username.value)
    console.log('Email:', email.value)
    console.log('Password:', password.value)
  }
  </script>
  
  <style scoped>
  @import '../assets/register.css';
  </style>