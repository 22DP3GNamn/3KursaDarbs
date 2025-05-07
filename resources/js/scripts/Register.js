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
        alert('Passwords do not match!');
        return;
      }
      try {
        await axios.post('/register', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.confirmPassword,
        });
        window.location.href = '/profile';
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message || 'An error occurred during registration.');
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    },
  },
};
