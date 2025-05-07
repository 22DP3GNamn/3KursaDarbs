<template>
  <nav id="navbar" class="visible">
    <div class="logo"><a href="/">Test Page</a></div>
    <ul class='left-nav'>
      <li><a class="button" href="/game">Game</a></li>
      <li v-if="!user && currentPath !== '/login'"><a class="button" href="/login">Login</a></li>
      <li v-if="!user && currentPath !== '/register'"><a class="button" href="/register">Registration</a></li>
      <li v-if="user && user.role === 'admin'"><a class="button" href="/admin">Dashboard</a></li>
    </ul>
    <a v-if="user" class="profile-btn" href="/profile">
      <img src="/Images/defaultpfp.png" alt="Profile">
    </a>
  </nav>
  
  <div class="side-wall">
    <div id="menu-btn-container">
      <div id="menu-btn">
        <input type="checkbox" id="menu-checkbox" />
        <label for="menu-checkbox" id="menu-label">
          <div id="menu-bar"></div>
        </label>
      </div>
    </div>

    <ul>
      <li><a class='sidewall-button' href="/game">Game</a></li>
      <li v-if="!user"><a class='sidewall-button' href="/login">Login</a></li>
      <li v-if="!user"><a class='sidewall-button' href="/register">Registration</a></li>
      <li v-if="user && user.role === 'admin'"><a class="sidewall-button" href="/admin">Dashboard</a></li>
    </ul>
    <form v-if="user" method="POST" action="/logout" class="sidewall-logout-form">
      <input type="hidden" name="_token" :value="csrfToken">
      <button type="submit" class="sidewall-logout-btn">Logout</button>
    </form>

    <div v-if="user" class="sidewall-profile-container">
      <a class="sidewall-profile-btn" href="/profile">
        <img src="/Images/defaultpfp.png" alt="Profile">
      </a>
      <span class="username">{{ user.username }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      csrfToken: document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      currentPath: window.location.pathname,
    };
  },
  mounted() {
    this.fetchUserSession();
  },
  methods: {
    async fetchUserSession() {
      try {
        const response = await fetch('/api/user-session');
        if (response.ok) {
          const data = await response.json();
          this.user = data.user;
          console.log('User session fetched:', this.user);
        } else {
          this.user = null;
          console.log('No user session found');
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
        this.user = null;
      }
    },
  },
};
</script>

