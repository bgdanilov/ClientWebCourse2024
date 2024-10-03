Vue.createApp({})
    .component("PhoneBook", {
        data() {
            return {
                contacts: [
                    {id: 1, name: "Boris", family: "Danilov", phone: "121"},
                    {id: 2, name: "Ivan", family: "Borisov", phone: "122"},
                    {id: 3, name: "Petr", family: "Ivanov", phone: "123"}
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
              :contacts="this.contacts"
              @remove="removeContact"
          />`
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
                    family: "",
                    phone: ""
                },

                isSubmitted: false,
                isFormReset: true,
                isNameValid: false,
                isFamilyValid: false,
                isPhoneValid: false
            }
        },

        methods: {
            createContact() {
                // Берем их Props текущий id и на его основе создаем новый для контакта.
                this.contact.id = this.currentId + 1;

                if (!this.isNameValid || !this.isFamilyValid || !this.isPhoneValid) {
                    this.isFormReset = false;
                    return;
                }

                this.$emit("add", this.contact);

                // Очищаем сгенерированный контакт.
                this.contact = {
                    name: "",
                    family: "",
                    phone: ""
                }

                // Это true и было true - изменения нет, watch не сработает!
                this.isFormReset = true;
                this.isNameValid = false;
                this.isFamilyValid = false;
                this.isPhoneValid = false;
            },
        },

        // 1. Начальный параметр inputValue xсвязан с contact.name
        template: `
            <form @submit.prevent>
              <input-field
                  id = "name"
                  type = "text"
                  label = "Имя"
                  fieldTextMessage = "Введите имя"
                  v-model:inputValue = "contact.name"
                  :isSubmitted = isSubmitted
                  :isFormReset = isFormReset
                  :isFieldValid = isNameValid
                  :contacts = "contacts"
                  @updateIsFormReset = "isFormReset = $event"
                  @updateInputValue = "contact.name = $event"
                  @updateIsFieldValid = "isNameValid = $event"
              />
              <input-field
                  id = "family"
                  type = "text"
                  label = "Фамилия"
                  fieldTextMessage = "Введите фамилию"
                  v-model:inputValue = "contact.family"
                  :isSubmitted = isSubmitted
                  :isFormReset = isFormReset
                  :isFieldValid = isFamilyValid
                  :contacts = "contacts"
                  @updateIsFormReset = "isFormReset = $event"
                  @updateInputValue = "contact.family = $event"
                  @updateIsFieldValid = "isFamilyValid = $event"
              />
              <input-field
                  id = "phone"
                  type = "phone"
                  label = "Телефон"
                  fieldTextMessage = "Введите телефон"
                  v-model:inputValue = "contact.phone"
                  :isSubmitted = isSubmitted
                  :isFormReset = isFormReset
                  :isFieldValid = isPhoneValid
                  :contacts = "contacts"
                  @updateIsFormReset = "isFormReset = $event"
                  @updateInputValue = "contact.phone = $event"
                  @updateIsFieldValid = "isPhoneValid = $event"
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
            label: String,
            fieldTextMessage: String,
            inputValue: String,
            isFormReset: Boolean,
            isFieldValid: Boolean,
            isSubmitted: Boolean,

            contacts: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                isFieldValid1: this.isFieldValid,
                warningMessage: this.fieldTextMessage,
                isFieldReset: this.isFormReset,
                class: "",
            }
        },

        watch: {
            isFormReset() {
                if (this.isFormReset) {
                    this.class = "";
                } else {
                    if (!this.isFieldValid1) {
                        this.class = "is-invalid";
                    } else {
                        this.class = "is-valid";
                    }
                }
            }
        },

        methods: {
            updateInputValue(event) {
                const inputValue = event.target.value;

                if (this.type === "phone") {
                    if (this.isPhoneAlreadyExist(inputValue)) {
                        this.isFieldValid1 = false;
                        this.warningMessage = "Такой телефон уже есть."
                    } else {
                        this.isFieldValid1 = inputValue.length !== 0;
                        this.warningMessage = this.fieldTextMessage;
                    }
                } else {
                    this.isFieldValid1 = inputValue.length !== 0;
                }

                this.class = this.getClass();

                this.$emit("updateInputValue", inputValue);
                this.$emit("updateIsFieldValid", this.isFieldValid1);
            },

            isPhoneAlreadyExist(value) {
                return this.contacts.find(item => item.phone.trim() === value);
            },

            getClass() {
                    if (this.isFieldValid1) {
                        return "is-valid";
                    } else if(!this.isFieldValid1) {
                        return "is-invalid";
                    }
            }
        },

        template: `
          <div class="col">
            <label for="validationCustom03" class="form-label">{{ label }}</label>
            <input
                :id
                :type
                :value = "inputValue"
                @input = "updateInputValue"
                class="form-control"
                :class = this.class
            >
            <div class="invalid-feedback">
              {{ this.warningMessage }}
            </div>
          </div>`
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
                console.log(this.contact.name);
            }
        },

        template: `
          <tr>
            <td>{{ contact.name }}</td>
            <td>{{ contact.family }}</td>
            <td>{{ contact.phone }}</td>
            <td>
              <button class="btn btn-primary" type="button" @click="edit">Edit</button>
              <button class="btn btn-danger" type="button" @click="$emit('remove', contact)">Delete</button>
            </td>
          </tr>`
    })
.mount("#app");