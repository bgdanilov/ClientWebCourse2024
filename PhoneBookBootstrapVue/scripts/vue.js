Vue.createApp({})
.component("PhoneBook", {
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
    },

    template: `
        <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
                    type="text"
                    id="username"
                    v-model="username"
                    :class="{'is-invalid': !isUsernameValid && submitted,
                             'is-valid': isUsernameValid && submitted}"
                    class="form-control"
                    required
            />
            <!--<div class="valid-feedback">Looks good</div>-->
            <div class="invalid-feedback">{{ usernameErrorMessage }}</div>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>`
}).mount("#app");