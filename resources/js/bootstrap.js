import 'bootstrap';
import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Laravel = window.Laravel || {};

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || '8375e9a963d4a8e727c9',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu',
    forceTLS: true
});

function showCenterPopup(message) {
    let oldPopup = document.getElementById('party-invite-popup');
    if (oldPopup) oldPopup.remove();

    let popup = document.createElement('div');
    popup.id = 'party-invite-popup';
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'rgba(30, 41, 59, 0.98)';
    popup.style.color = '#fff';
    popup.style.padding = '32px 48px';
    popup.style.borderRadius = '16px';
    popup.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)';
    popup.style.zIndex = 99999;
    popup.style.fontSize = '1.35rem';
    popup.style.textAlign = 'center';
    popup.style.fontWeight = 'bold';
    popup.style.letterSpacing = '0.02em';
    popup.style.maxWidth = '90vw';
    popup.style.wordBreak = 'break-word';
    popup.style.pointerEvents = 'none';
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 4000);
}

window.showCenterPopup = showCenterPopup;

if (window.Laravel.user && window.Laravel.user.id) {
    console.log('Listening on channel:', 'user.' + window.Laravel.user.id);
    const channel = window.Echo.channel('user.' + window.Laravel.user.id);

    // Listen for default event name
    channel.listen('PartyInvitationSent', (e) => {
        console.log('Received event (short name):', e);
        showCenterPopup(e.message);
    });

    // Listen for fully qualified event name (sometimes Laravel uses this)
    channel.listen('.App\\Events\\PartyInvitationSent', (e) => {
        console.log('Received event (FQCN):', e);
        showCenterPopup(e.message);
    });

    // Listen for FQCN without dot (rare, but possible)
    channel.listen('App\\Events\\PartyInvitationSent', (e) => {
        console.log('Received event (FQCN no dot):', e);
        showCenterPopup(e.message);
    });
} else {
    console.log('User not authenticated or window.Laravel.user is undefined');
}
