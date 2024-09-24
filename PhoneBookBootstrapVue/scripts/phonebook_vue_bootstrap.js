Vue.createApp({})
    .component("PhoneBook", {
        // Конструктор компонента - начальное состояние.
        data() {
            return {
                contacts: [],
                contactNameText: "",
                initialContactId: 1
            };
        },

        methods: {
            addContact() {
                const newContact = {
                    id: this.initialContactId,
                    contactName: this.contactNameText
                };

                this.initialContactId++;
                this.contactNameText = "";
                this.contacts.push(newContact);
            }
        },


        template:  `<form @submit.prevent="addContact" class="row">
                    <label class="col">
                        <input v-model="contactNameText" class="form-control" type="text">
                    </label>
                    <div class="col-auto">
                        <button class="btn btn-primary">Add</button>
                    </div>
                    </form>

                    <table>
                        <phone-book-contact v-for="contact in contacts"
                                           :key="contact.id"
                                           :contact="contact">
                        </phone-book-contact>
                    </table>`
    })

    .component("PhoneBookContact", {
        // У компонентов могут быть параметры (props) – входные данные.
        props: {
            contact: {
                type: Object,
                required: true
            }
        },

        // Конструктор компонента - начальное состояние.
        data() {
            return {};
        },

        template: `<tr><td>{{ contact.contactName }}</td></tr>`
    })

    .mount("#app");
