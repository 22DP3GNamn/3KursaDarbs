import NotificationManager from './NotificationManager.js'; // Ensure this path is correct

export default {
    props: {
        user: {
            type: Object,
            required: false,
            default: null,
        },
        profileImage: {
            type: String,
            required: true,
        },
        updateUrl: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            form: {
                username: this.user ? this.user.username : '', // Changed "name" to "username"
                email: this.user ? this.user.email : '',
                password: '',
                password_confirmation: '',
            },
        };
    },
    computed: {
        csrfToken() {
            return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        },
    },
    methods: {
        async updateProfile() {
            try {
                const response = await axios.post(this.updateUrl, this.form, {
                    headers: {
                        'X-CSRF-TOKEN': this.csrfToken,
                    },
                });
                NotificationManager.showNotification(response.data.message, 'bg-green-500');
            } catch (error) {
                if (error.response && error.response.data.errors) {
                    const errors = Object.values(error.response.data.errors).flat();
                    NotificationManager.showNotification(`Failed to update profile: ${errors.join(', ')}`, 'bg-red-500');
                } else {
                    NotificationManager.showNotification('Failed to update profile. Please try again later.', 'bg-red-500');
                }
            }
        },
        async logout() {
            try {
                const response = await axios.post('/logout', {}, {
                    headers: {
                        'X-CSRF-TOKEN': this.csrfToken,
                    },
                });
                NotificationManager.showNotification('Logged out successfully!', 'bg-green-500');
                window.location.href = '/login';
            } catch (error) {
                NotificationManager.showNotification('Failed to logout. Please try again later.', 'bg-red-500');
            }
        },
    },
};
