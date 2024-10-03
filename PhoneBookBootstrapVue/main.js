const app = Vue.createApp({
    data() {
        return {
            username: '',
            usernameErrorMessage: '',
            submitted: false,
        };
    },
    computed: {
        isUsernameValid() {
            if (this.username.length < 4) {
                this.usernameErrorMessage = "Must be > 4";
                return false;
            } else if (this.username.length > 10) {
                this.usernameErrorMessage = "Must be < 10";
                return false;
            } else {
                return true;
            }
        },
    },
    methods: {
        handleSubmit() {
            this.submitted = true;

            if (!this.isUsernameValid) {
                return;
            }

            alert("Form submitted successfully!");
        }
    }
});

app.mount('#app');
