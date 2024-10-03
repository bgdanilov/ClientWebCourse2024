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

                isFirstNameFieldReset: true,
                isLastNameFieldReset: true,

                isFirstNameFieldValid: false,
                isLastNameFieldValid: false
            };
        },

        methods: {
            onSubmit(event) {
                if (this.isFirstNameFieldValid) {
                    this.isFirstNameFieldReset = false;
                }

                if (this.isLastNameFieldValid) {
                    this.isLastNameFieldReset = false;
                }

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
                if (!this.isFirstNameFieldValid || !this.isLastNameFieldValid) {
                    //this.isFirstNameFieldValid = false;
                    //this.isLastNameFieldValid = false;
                    return;
                }

                const newContact = {
                    id: ++this.initialContactId,
                    firstName: this.firstNameFieldText,
                    lastName: this.lastNameFieldText
                };

                this.contacts.push(newContact);

                this.isFirstNameFieldReset = false;
                this.isLastNameFieldReset = false;
                this.firstNameFieldText = "";
                this.lastNameFieldText = "";
                this.isFirstNameFieldValid = false;
                this.isLastNameFieldValid = false;
            },

            saveContact() {
                if (!this.isFirstNameFieldValid || !this.isLastNameFieldValid) {
                    return;
                }

                this.editingContact = this.contacts.find(contact => contact.id === this.editingContactId);

                this.editingContact.firstName = this.firstNameFieldText;
                this.editingContact.lastName = this.lastNameFieldText;
            },

            deleteContact() {
                const deletedContactIndex = this.contacts.findIndex(contact => contact.id === this.editingContactId);
                this.contacts.splice(deletedContactIndex, 1);
            }
        },

        template:  `
          <form @submit.prevent="onSubmit" class="row needs-validation" novalidate>
            <text-input :fieldText="firstNameFieldText"
                        :isFieldReset="isFirstNameFieldReset"
                        @update="firstNameFieldText = $event[0]; isFirstNameFieldValid = $event[1];"></text-input>
            <text-input :fieldText="lastNameFieldText"
                        :isFieldReset="isLastNameFieldReset"
                        @update="lastNameFieldText = $event[0]; isLastNameFieldValid = $event[1];"></text-input>
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
        props: ['fieldText', 'isFieldReset'],

        // Конструктор компонента - начальное состояние.
        data() {
            return {
                inputValue: "",
                fieldTextMessage: "",
                //isFieldReset1: true,
            };
        },

        watch: {
          isFieldReset() {
              if (this.isFieldReset) {
                  this.isFieldReset1 = true;
              } else {
                  this.isFieldReset1 = false;
              }

              console.log(this.isFieldReset1);
             //this.isFieldReset1 = true;
            }
        },

        // Это поля как в data, только они вычисляемые! Зависимые от чего-то.
        computed: {
           calcValue() {
               console.log(this.isFieldReset1);
               return this.fieldText;
            },

            isFieldReset1() {
               console.log(this.isFieldReset);

                if (this.isFieldReset) {
                    return true;
                } else {
                    return false;
                }
            },

            isFieldValid() {
               if (this.inputValue.length === 0) {
                   this.fieldTextMessage = "Введите значение!";
                   return false;
               } else {
                   return true;
                }
            },
        },

        methods: {
            onInput(e) {
                //this.isFieldReset1 = false; // при вводе поле уже не сброшенное.
                this.inputValue = e.target.value;
                this.$emit('update', [this.inputValue, this.isFieldValid]);
            },
        },

        template: `
          <div class="col">
            <label for="validationCustom03" class="form-label">City</label>
            <input type="text"
                   class="form-control"
                   v-on:input="onInput"
                   v-bind:value="calcValue"
                   :class="{'is-invalid': !isFieldValid && !isFieldReset1,
                            'is-valid': isFieldValid && !isFieldReset1,
                            '': isFieldReset1}">
            <div class="invalid-feedback">
              {{ fieldTextMessage }}
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
