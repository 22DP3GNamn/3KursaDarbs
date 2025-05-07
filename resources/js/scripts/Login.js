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
                    window.location.href = '/profile';
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    alert(error.response.data.error || 'Invalid credentials');
                } else {
                    alert('An error occurred. Please try again.');
                }
            }
        },
    },
};