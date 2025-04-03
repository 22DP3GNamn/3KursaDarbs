<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ref } from 'vue'
import { toggleDarkMode } from './router/darkmode.js'

// Reactive variable to track authentication state
const isLoggedIn = ref(false)

const isDarkMode = ref(false)
const route = useRoute()

function handleDarkModeToggle() {
  isDarkMode.value = !isDarkMode.value
  toggleDarkMode(isDarkMode.value)
}

// Mock login function (replace with real authentication logic)
function login() {
  isLoggedIn.value = true
}

// Mock logout function (replace with real authentication logic)
function logout() {
  isLoggedIn.value = false
}
</script>

<template>
  <header>
    <nav>
      <div class="nav-left">
          <span class="brand-name">YGvido</span>
      </div>
      <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
      <div class="nav-links" id="navLinks">
          <a href="#" id="darkModeToggle" class="button" @click="handleDarkModeToggle"><span>Dark Mode</span></a>
          <div class="dropdown">
              <a class="dropbtn">Services</a>
              <div class="dropdown-content">
                  <a href="game1.html">Service1</a>
                  <a href="game2.html">Service2</a>
                  <a href="game3.html">Service3</a>
              </div>
          </div>
          <a href="about.html" class="button"><span>About</span></a>
          <a href="contact.html" class="button"><span>Contact</span></a>
          <RouterLink v-if="route.path !== '/login'" to="/login" class="button"><span>Login</span></RouterLink>
          <RouterLink v-if="route.path === '/login'" to="/register" class="button"><span>Register</span></RouterLink>
          <button v-if="isLoggedIn" @click="logout" class="button"><span>Logout</span></button>
      </div>
  </nav>
  </header>

  <RouterView />
</template>

<style scoped>
@import './assets/base.css';

</style>