import { createApp } from 'vue';
import Notification from '../layouts/Notification.vue';

export default {
  showNotification(message, bgColor = 'bg-green-500') {
    const container = document.createElement('div');
    container.className = 'fixed top-30 left-1/2 transform -translate-x-1/2 items-center';
    document.body.appendChild(container);
    const app = createApp(Notification, { message, bgColor });
    const instance = app.mount(container);
    setTimeout(() => {
      app.unmount();
      document.body.removeChild(container);
    }, 5000);
  },
};