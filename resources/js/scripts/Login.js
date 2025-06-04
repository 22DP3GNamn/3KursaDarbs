import NotificationManager from '../scripts/NotificationManager';

export default {
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('/login', this.form);
                if (response.status === 200) {
                    NotificationManager.showNotification('Login successful! Redirecting...', 'bg-green-500');
                    setTimeout(() => {
                        window.location.href = '/profile';
                    }, 1000);   
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    NotificationManager.showNotification(error.response.data.error || 'The email or password you entered is incorrect.', 'bg-red-500');
                } else {
                    NotificationManager.showNotification('An error occurred. Please try again.', 'bg-red-500');
                }
            }
        },
    },
};