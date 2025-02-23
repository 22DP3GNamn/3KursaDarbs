<template>
    <div class="game-card">
      <img :src="game.image" alt="Game Image" class="game-image" />
      <h3 class="game-title">{{ game.title }}</h3>
      <p class="game-description">{{ game.description }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GameCard',
    props: {
      game: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .game-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .game-card:hover {
    transform: scale(1.05);
  }
  
  .game-image {
    width: 100%;
    height: auto;
  }
  
  .game-title {
    font-size: 1.2em;
    margin: 0.5em 0;
  }
  
  .game-description {
    font-size: 0.9em;
    color: #666;
  }
  </style>