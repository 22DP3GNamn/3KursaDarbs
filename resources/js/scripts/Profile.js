export default {
    props: {
      user: Object,
      profileImage: String,
    },
    methods: {
      async logout() {
        try {
          const response = await axios.post('/logout');
          if (response.status === 200) {
            window.location.href = '/login';
          }
        } catch (error) {
          NotificationManager.showNotification('An error occurred while logging out. Please try again.');
        }
      },
    },
  };