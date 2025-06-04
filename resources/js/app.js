import './bootstrap';
import { createApp } from 'vue';
import ProfilePage from './components/ProfilePage.vue';
import RegistrationPage from './components/RegistrationPage.vue';
import LoginPage from './components/LoginPage.vue';
import AdminPage from './components/AdminPage.vue';
import HomePage from './components/HomePage.vue';
import GamePage from './components/GamePage.vue';
import ExamplePage from './components/ExamplePage.vue';
import PartyPage from './components/PartyPage.vue'; // Import PartyPage component
import AppLayout from './layouts/App.vue';

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
    .component('party-page', PartyPage) // Register PartyPage component

    .mount('#app');

