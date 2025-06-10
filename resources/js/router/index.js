import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import GamePage from '../components/GamePage.vue';

const routes = [
    // ...existing routes...
    { path: '/', name: 'home', component: HomePage },
    { path: '/game/:id', name: 'game.show', component: GamePage, props: true }, // Ensure props are passed
    // ...existing routes...
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
