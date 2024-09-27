Vue.createApp({})
    .component("PhoneBook", {
        // Конструктор компонента - начальное состояние.
        data() {
            return {
                contacts: [],
                initialContactId: 1,
                firstNameFieldText: "",
                lastNameFieldText: "",

                isEditing: false,
                editingContact: {},
                editingContactId: "",

                isContactFormReset: true,
                isFirstNameFieldReset: true,
                isLastNameFieldReset: true,

                isFirstNameFieldValid: false,
                isLastNameFieldValid: false
            };
        },

        methods: {
            onSubmit(event) {
                const submitButtonPressed = event.submitter.name;

                if (submitButtonPressed === "add") {
                    this.addContact();
                } else if (submitButtonPressed === "save") {
                    this.saveContact();
                }
            },

            onEdit(event) {
                this.editingContactId = event[0];

                this.firstNameFieldText = event[1];
                this.lastNameFieldText = event[2];

                this.isEditing = true;
            },

            onDelete(event) {
                this.deleteContact(event);
            },

            addContact() {
                console.log(this.isFirstNameFieldValid);
                console.log(this.isLastNameFieldValid);

                if (this.isFirstNameFieldValid && this.isLastNameFieldValid) {
                    const newContact = {
                        id: ++this.initialContactId,
                        firstName: this.firstNameFieldText,
                        lastName: this.lastNameFieldText
                    };

                    this.contacts.push(newContact);
                    this.resetContactForm();
                } else {
                    this.isFirstNameFieldReset = false;
                    this.isLastNameFieldReset = false;
                }
            },

            saveContact() {
                if (!this.isFirstNameFieldValid || !this.isLastNameFieldValid) {
                    return;
                }

                this.editingContact = this.contacts.find(contact => contact.id === this.editingContactId);

                this.editingContact.firstName = this.firstNameFieldText;
                this.editingContact.lastName = this.lastNameFieldText;

                this.resetContactForm();
            },

            deleteContact() {
                const deletedContactIndex = this.contacts.findIndex(contact => contact.id === this.editingContactId);
                this.contacts.splice(deletedContactIndex, 1);
                this.resetContactForm();
            },

            resetContactForm() {
                this.firstNameFieldText = "";
                this.lastNameFieldText = "";

                this.isFirstNameFieldReset = true;
                this.isLastNameFieldReset = true;

                this.isFirstNameFieldValid = false;
                this.isLastNameFieldValid=  false;

                this.isEditing = false;
            },
        },

        template:  `
          <form @submit.prevent="onSubmit" class="row needs-validation" novalidate>
            <text-input :text=this.firstNameFieldText
                        :isReset="isFirstNameFieldReset"
                        :isValid="isFirstNameFieldValid"
                        @update="firstNameFieldText = $event[0]; isFirstNameFieldValid = $event[1]; isFirstNameFieldReset=false"></text-input>
            <text-input :text=this.lastNameFieldText
                        :isReset="isLastNameFieldReset"
                        :isValid="isLastNameFieldValid"
                        @update="lastNameFieldText = $event[0]; isLastNameFieldValid = $event[1]; isLastNameFieldReset=false"></text-input>
            <div class="col">
                <div v-if="!isEditing" class="col-auto">
                  <button name="add" class="btn btn-primary">Add</button>
                </div>
                <div v-else class="col-auto">
                  <button name="save" class="btn btn-primary">Save</button>
                </div>
            </div>
          </form>

          <table>
            <phone-book-contact v-for="contact in contacts"
                                :key="contact.id"
                                :contact="contact"
                                @edit-item="onEdit($event)"
                                @del-item="onDelete($event)">
            </phone-book-contact>
          </table>`
    })

    .component("TextInput", {
        props: ['isReset', 'text'],

        // Конструктор компонента - начальное состояние.
        data() {
            return {
                isFieldValid: false,
            };
        },

        methods: {
            onInput(e) {
                this.$emit('update', [e.target.value, this.isFieldValid]);
            }
        },

        computed: {
            calcValue() {
                this.isFieldValid = this.text.trim().length !== 0;
                console.log("isFieldValid = " + this.isFieldValid);
                return this.text;
            },

            validClass() {
                if (this.isReset) {
                    return  "";
                } else {
                    return  this.isFieldValid ? "is-valid" : "is-invalid";
                }
            }
        },

        template: `
          <div class="col">
            <label for="validationCustom03" class="form-label">City</label>
            <input v-on:input="onInput" v-bind:class="validClass" v-bind:value="calcValue" type="text" class="form-control">
            <div class="invalid-feedback">
              Please provide a valid city.
            </div>
          </div>`
    })

    .component("PhoneBookContact", {
        // У компонентов могут быть параметры (props) – входные данные.
        props: {
            contact: {
                type: Object,
                required: true
            }
        },

        methods: {
            edit() {
                this.$emit("edit-item", [this.contact.id, this.contact.firstName, this.contact.lastName]);
            },

            del() {
                this.$emit("del-item", this.contact.id);
            }
        },

        template: `
          <tr>
            <td>{{ contact.firstName }}</td>
            <td>{{ contact.lastName }}</td>
            <td>
                <button class="btn btn-primary" type="button" @click="edit">Edit</button>
                <button class="btn btn-danger" type="button" @click="del">Delete</button>
            </td>
          </tr>`
    })

    .mount("#app");
