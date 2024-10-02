Vue.createApp({})
    .component("PhoneBook", {
        data() {
            return {
                contacts: [
                    {id: 1, name: "Boris", family: "Danilov"},
                    {id: 2, name: "Ivan", family: "Borisov"},
                    {id: 3, name: "Petr", family: "Ivanov"}
                ],

                currentId: 3,
            };
        },

        methods: {
            addContact(contact) {
                this.contacts.push(contact);
                this.currentId = contact.id; // перезаписываем текущий id;
            },

            removeContact(contact) {
                this.contacts = this.contacts.filter(c => c.id !== contact.id);
            }
        },

        template: `
          <contact-form 
              :currentId="this.currentId"
              :contacts = "this.contacts"
              @add="addContact"
          />
          <contacts-list
              v-bind:contacts="this.contacts"
              @remove="removeContact"
          />`
    })

    .component("contactsList", {
        // Это как-бы аргументы Компонента как функции.
        props: {
            contacts: {
                type: Array,
                required: true
            },
        },

        emits: ['remove'],

        methods: {},

        template: `
          <h3>Список контактов</h3>
          <table>
            <contact-item 
                v-for="contact in contacts"
                :contact = "contact"
                :key = "contact.id"
                @remove = "$emit('remove', contact)"
            />
          </table>`
    })

    .component("contactItem", {
        props: {
            contact: {
                type: Object,
                required: true
            }
        },

        methods: {
            del(contact) {
            },

            edit() {
            }
        },

        template: `
          <tr>
            <td>{{ contact.name }}</td>
            <td>{{ contact.family }}</td>
            <td>
              <button class="btn btn-primary" type="button" @click="edit">Edit</button>
              <button class="btn btn-danger" type="button" @click="$emit('remove', contact)">Delete</button>
            </td>
          </tr>`
    })

    .component("contactForm", {
        props: {
            currentId: "",

            contacts: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                contact: {
                    name: "",
                    family: ""
                },

                isFormReset: true
            }
        },

        methods: {
            createContact() {
                // Берем их Props текущий id и на его основе создаем новый для контакта.
                this.contact.id = this.currentId + 1;
                this.$emit("add", this.contact);

                // Очищаем сгенерированный контакт.
                this.contact = {
                    name: "",
                    this: ""
                }

                this.isFormReset = true;
                console.log("isFormReset = " + this.isFormReset);
            },
        },

        template: `
            <form @submit.prevent>
              <input-field
                  id = "name"
                  type = "text"
                  fieldTextMessage = "Введите имя"
                  :isFormReset = isFormReset
                  @reset = "isFormReset = $event"
                  v-model:inputValue = "contact.name"
                  :contacts = "contacts"
              />
              <input-field
                  id = "family"
                  type = "text"
                  fieldTextMessage = "Введите фамилию"
                  :isFormReset = "isFormReset"
                  @reset = "isFormReset = $event"
                  v-model:inputValue = "contact.family"
                  :contacts = "contacts"
              />
              <button v-on:click="createContact" class="btn btn-primary">Добавить</button>
            </form>`
    })

    .component("inputField", {
        // В качестве аргумента принимает inputValue из Родителя - формы.
        // Это просто Аргумент!!!
        props: {
            id: String,
            type: String,
            inputValue: String,
            fieldTextMessage: String,
            isFormReset: Boolean,

            contacts: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                isFieldEmpty: false,
                isFieldReset: this.isFormReset
            }
        },

        watch: {
            isFormReset() {
                this.isFieldReset = true;
            }
        },

        methods: {
            updateInputValue(event) {
                const inputValue = event.target.value;
                this.isFieldEmpty = inputValue.length < 1;

                if (this.isPhoneAlreadyExist(inputValue)) {
                    console.log("ffff");
                }
                //console.log(this.contacts[0].name);

                this.$emit("update:inputValue", inputValue);
                this.$emit("reset", false);
                this.isFieldReset = false;

                console.log(inputValue.length);
                console.log(this.isFieldEmpty);
                console.log(this.isFieldReset);
            },

            isPhoneAlreadyExist(name) {
                return this.contacts.find(item => item.name.trim() === name);
            }
        },

        template: `
          <div class="col">
            <label for="validationCustom03" class="form-label">City</label>
            <input
                :id
                :type
                :value = "inputValue"
                @input = "updateInputValue"
                class="form-control"
                :class="{'is-invalid': isFieldEmpty && !this.isFieldReset,
                         'is-valid': !isFieldEmpty && !this.isFieldReset}"
            >
            <div class="invalid-feedback">
              {{ fieldTextMessage }}
            </div>
          </div>`
    })
.mount("#app");