import './bootstrap';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import ProfilePage from './components/ProfilePage.vue';
import RegistrationPage from './components/RegistrationPage.vue';
import LoginPage from './components/LoginPage.vue';
import AdminPage from './components/AdminPage.vue';
import HomePage from './components/HomePage.vue';
import GamePage from './components/GamePage.vue';
import ExamplePage from './components/ExamplePage.vue';
import PartyPage from './components/PartyPage.vue';
import AppLayout from './layouts/App.vue';
import CreateGamePage from './components/CreateGamePage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/game/:id', name: 'game.show', component: GamePage, props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Create a global event bus
const eventBus = createApp({});
eventBus.config.globalProperties.$eventBus = eventBus;

// Example usage: Emit and listen to events
// $eventBus.emit('event-name', payload);
// $eventBus.on('event-name', callback);

createApp({})
    /* LAYOUTS */
    .component('AppLayout', AppLayout)

    /* PAGES */
    .component('home-page', HomePage)
    .component('login-page', LoginPage)
    .component('profile-page', ProfilePage)
    .component('registration-page', RegistrationPage)
    .component('admin-page', AdminPage)
    .component('game-page', GamePage)
    .component('example-page', ExamplePage)
    .component('party-page', PartyPage)
    .component('create-game-page', CreateGamePage)

    .use(router) // Ensure the router is used
    .mount('#app');

