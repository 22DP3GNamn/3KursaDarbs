<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

</script>

<template>
  <header>
    <nav>
      <div class="nav-left">
          <span class="brand-name">GAMESTOP</span>
      </div>
      <div class="hamburger" onclick="toggleMenu()">&#9776;</div>
      <div class="nav-links" id="navLinks">
          <a href="#" id="darkModeToggle" class="button"><span>Dark Mode</span></a>
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
          <a href="login.html" class="button"><span>Login</span></a>
      </div>
  </nav>
  </header>

  <RouterView />
</template>

<style scoped>

body {
    z-index: -1;
    font-family: Arial, sans-serif;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

.brand-name {
    font-size: 35px;
    font-weight: bold;
    color: #ffffff;
    margin-left: 30px;
}

.logo-image {
    width: 300px;
    height: auto;
}

.game-box {
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 25px 10px;
    justify-items: center ;
    transition: width 2s ease-in-out 1s;
}

.game1:hover, .game2:hover, .game3:hover {
    transform: scale(1.1);
    transition: 0.5s;
    background: linear-gradient(0deg, #ffffff, #686767);
    box-shadow: 0 50px 50px rgba(0, 0, 0, 0.2);
}

.game1:not(:hover), .game2:not(:hover), .game3:not(:hover) {
    transform: scale(1);
    transition: transform 0.5s, background 0.5s, box-shadow 0.5s;
    background: linear-gradient(0deg, #ffffff, #686767);
    box-shadow: 0 40px 40px rgba(0, 0, 0, 0.1);
}
.game1, .game2, .game3 {
    max-width: 300px;
    min-width: 300px;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 40px 40px rgba(0, 0, 0, 0.1);
    background: linear-gradient(0deg, #ffffff, #ffffff);
}

.game-box a {
    color: #fff;
    text-decoration: none;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    display: block;
    padding: 10px;
    border-radius: 10px;
    background-color: #000000;
    transition: 0.5s;
    display: inline-block;
}

nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    text-align: right;
}

a {
    padding: 10px 40px;
    border-radius: 15px;
    margin-right: 12px;
    background-color: #000000;
    color: #fff;
    text-decoration: none;
    display: inline-block;
    transition: 0.5s;
    z-index: 1;
}

nav a{
    transform: translateX(-38px);
}

.button {
    padding: 10px 40px;
    border-radius: 15px;
    margin-right: 12px;
    background-color: #000000;
    color: #fff;
    text-decoration: none;
    display: inline-block;
    transition: 0.5s;
    z-index: 1;
}

.button:hover {
    background-color: #797979;
    color: #fff;
    transition: 0.5s;
}

body.dark-mode {
    background-color: #000000;
    color: #e0e0e0;
}

body.dark-mode a {
    color: #ffffff;
}

body.dark-mode .game-box {
    background-color: #000000;
}

body.dark-mode .game1, body.dark-mode .game2, body.dark-mode .game3 {
    background: linear-gradient(0deg, #333, #444);
    box-shadow: 0 40px 40px rgba(0, 0, 0, 0.5);
}

.hamburger {
    display: none;
    font-size: 30px;
    cursor: pointer;
}

.nav-links {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.nav-left {
    display: flex;
    align-items: center;
}

header {
    background: linear-gradient(90deg, #000000, #c4c2c2);
    color: #ffffff;
    padding: 20px 10px;
    text-align: right;
    margin-bottom: 20px;
    max-width: 100%;
    transition: background 0.8s ease-in-out 0.2s;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}

header::before {
    content: '';
    position: absolute;
    top: 0;
    left: -14%;
    width: 35%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: skewX(-45deg);
    transition: left 0.7s ease-in-out;
    z-index: -1;
}

header:hover::before {
    left: 61.7%;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    padding: 4px 70px;
    z-index: 1;
}

.dropbtn {
    background-color: #000000;
    color: #fff;
    padding: 10px 40px;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.5s;
}

.dropbtn:hover, a:hover {
    background-color: #7e7e7e;
    color: #fff;
    transition: 0.5s;
}

.dropdown:hover .dropdown-content {
    display: block;
    transform: translateX(-75px);
}

/* Existing styles */
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 0; /* Changed from 2rem to 0 */
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 0; /* Changed from 1rem to 0 */
  }
}
</style>