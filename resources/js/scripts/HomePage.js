import Navigation from '../scripts/Navigation.js';
export default {
  data() {
    return {
      games: [],
      isMenuVisible: false,
    };
  },
  mounted() {
    // Fetch games from backend
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        this.games = data;
      });
    // Pass a callback to handle scroll visibility
    Navigation((scrollPosition) => {
      this.isMenuVisible = scrollPosition > 100;
    });
  },
};