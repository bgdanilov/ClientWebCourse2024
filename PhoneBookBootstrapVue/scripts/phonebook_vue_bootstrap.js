Vue.createApp({})
    .component("PhoneBook", {
        // Конструктор компонента - начальное состояние.
        data() {
            return {
                contacts: [],
                isEditing: false,
                firstNameFieldText: "",
                initialContactId: 1
            };
        },

        methods: {
            addContact() {
                const newContact = {
                    id: this.initialContactId,
                    firstName: this.firstNameFieldText
                };

                this.initialContactId++;
                this.firstNameFieldText = "";
                this.contacts.push(newContact);
            },

            bbb(event) {
                this.firstNameFieldText = event;
                this.isEditing = true;
            }
        },


        template:  `
          <form @submit.prevent="addContact" class="row">
            <label class="col">
              <input v-model="firstNameFieldText" class="form-control" type="text">
            </label>
            <div v-if = "!isEditing" class="col-auto">
              <button class="btn btn-primary">Add</button>
            </div>
            <div v-else class="col-auto">
              <button class="btn btn-primary">Save</button>
            </div>
          </form>

          <table>
            <phone-book-contact v-for="contact in contacts"
                                :key="contact.id"
                                :contact="contact"
                                @edit-item="bbb($event)">
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
            return {
                editingText: this.contact.firstName
            };
        },

        methods: {
            edit() {
                this.$emit("edit-item", this.editingText);
            },

            delete() {

            }
        },

        template: `
          <tr>
            <td>{{ contact.firstName }}</td>
            <td>
                <button class="btn btn-primary" type="button" @click="edit">Edit</button>
                <button class="btn btn-danger" type="button">Delete</button>
            </td>
          </tr>`
    })

    .mount("#app");
