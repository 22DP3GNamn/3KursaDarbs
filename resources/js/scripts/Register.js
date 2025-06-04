import NotificationManager from '../scripts/NotificationManager';

export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  methods: {
    async register() {
      if (this.form.password !== this.form.confirmPassword) {
        NotificationManager.showNotification('Passwords do not match!', 'bg-red-500');
        return;
      }
      try {
        await axios.post('/register', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.confirmPassword,
        });
        NotificationManager.showNotification('Registration successful! Redirecting...', 'bg-green-500');
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
      } catch (error) {
        if (error.response && error.response.data) {
          NotificationManager.showNotification(error.response.data.message || 'An error occurred during registration.', 'bg-red-500');
        } else {
          NotificationManager.showNotification('An error occurred. Please try again.', 'bg-red-500');
        }
      }
    },
  },
};