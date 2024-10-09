Vue.createApp({})
    .component("PhoneBook", {
        data() {
            return {
                contacts: [
                    {id: 1, firstName: "Boris", secondName: "Danilov", phone: "121"},
                    {id: 2, firstName: "Ivan", secondName: "Borisov", phone: "122"},
                    {id: 3, firstName: "Petr", secondName: "Ivanov", phone: "123"}
                ],
                currentId: 3,
                searchString: "",

                editedContact: Object(),
                dialogTitle: "",
                dialogMessage: "",

                firstName: "",
                secondName: "",
                phone: "",

                firstNameWarningMessage: "Введите имя",
                secondNameWarningMessage: "Введите фамилию",
                phoneWarningMessage: "Введите телефон",

                isFormSubmitted: false,
                isFormInEditingMode: false
            }
        },

        computed: {
            foundContacts() {
                // ... - аналог создания массива в цикле. Не портим исходный массив.
                const foundContacts = [...this.contacts];
                const searchString = this.searchString.toLowerCase().trim();

                return foundContacts.filter(c =>
                    c.firstName.toLowerCase().includes(searchString)
                    || c.secondName.toLowerCase().includes(searchString)
                    || c.phone.toLowerCase().includes(searchString));
            }
        },

        methods: {
            async onSubmit(event) {
                const submitButton = event.submitter.name;
                this.isFormSubmitted = true;

                if (submitButton === "add") {
                    if (this.isFormValid()) {
                        this.addContact();
                        this.isFormSubmitted = false;
                        this.resetFieldsValues();
                    }
                } else if (submitButton === "save") {
                    if (this.isFormValid()) {
                        const dialog = new bootstrap.Modal(document.getElementById("edit_modal"));
                        this.dialogTitle = "Сохранить изменения?"
                        this.dialogMessage = this.firstName + " " + this.secondName + "</br> Телефон: " + this.phone;

                        const isDialogConfirmed = await this.showModalDialog(dialog);

                        if (isDialogConfirmed) {
                            dialog.hide();
                            this.saveContact();
                            this.isFormSubmitted = false;
                            this.isFormInEditingMode = false;
                            this.resetFieldsValues();
                        }
                    }
                }
            },

            addContact() {
                const newContact = {
                    id: this.currentId + 1,
                    firstName: this.firstName,
                    secondName: this.secondName,
                    phone: this.phone
                };

                this.currentId++;
                this.contacts.push(newContact);
            },

            saveContact() {
                this.editedContact.firstName = this.firstName;
                this.editedContact.firstSecondName = this.secondName;
                this.editedContact.phone = this.phone;

                this.editedContact = {};
            },

            editContact(contact) {
                this.isFormSubmitted = false;
                this.isFormInEditingMode = true;

                this.firstName = contact.firstName;
                this.secondName = contact.secondName;
                this.phone = contact.phone;

                this.editedContact = contact;
            },

            cancel() {
                this.isFormInEditingMode = false;
                this.isFormSubmitted = false;

                this.resetFieldsValues();
                console.log("fff");
            },

            resetFieldsValues() {
                this.firstName = "";
                this.secondName = "";
                this.phone = "";
            },

            async removeContact(contact) {
                const dialog = new bootstrap.Modal(document.getElementById("edit_modal"));
                this.dialogTitle = "Удалить контакт?"
                this.dialogMessage = contact.firstName + " " + contact.secondName + "</br> Телефон: " + contact.phone;

                const isDialogConfirmed = await this.showModalDialog(dialog);
                this.dialogTitle = "Удалить?"

                if (isDialogConfirmed) {
                    dialog.hide();
                    this.contacts = this.contacts.filter(c => c.id !== contact.id);
                }

                this.isFormSubmitted = false;
            },

            validateTextField(inputValue) {
                if (this.isFormSubmitted) {
                    return inputValue.trim() !== "" ? "is-valid" : "is-invalid";
                }

                return "";
            },

            validatePhoneField(inputValue) {
                if (this.isFormSubmitted) {
                    if (this.isPhoneAlreadyExist(inputValue) && this.editedContact.phone !== inputValue) {
                        this.phoneWarningMessage = "Такой телефон уже есть"
                        return "is-invalid";
                    }

                    this.phoneWarningMessage = "Введите телефон."
                    return inputValue.trim() !== "" ? "is-valid" : "is-invalid";
                }

                return "";
            },

            isPhoneAlreadyExist(phone) {
                return this.contacts.find(contact => contact.phone.trim() === phone);
            },

            isFormValid() {
                return this.validateTextField(this.firstName) === "is-valid"
                    && this.validateTextField(this.secondName) === "is-valid"
                    && this.validatePhoneField(this.phone) === "is-valid"
            },

            showModalDialog(dialog) {
                return new Promise(function (resolve) {
                    dialog.show();

                    const confirmButton = document.getElementById("confirm_button");
                    const abortButton = document.getElementById("abort_button");

                    // onclick - выполняется единожды, поэтому удалять его после выполнения не надо.
                    confirmButton.onclick = function () {
                        resolve(true);
                    };

                    abortButton.onclick = function () {
                        resolve(false);
                    };
                });
            }
        },

        template: `
          <modal-dialog
              :header="dialogTitle"
              :message="dialogMessage"
          />
          <div class="row mb-4">
            <div class="col">
              <form @submit.prevent="onSubmit">
                <div class="row g-3">
                  <div class="col-md-4">
                    <input-field
                        id="firstName"
                        label="Имя"
                        :warningMessage="firstNameWarningMessage"
                        v-model:inputValue="firstName"
                        :validationClass="validateTextField(firstName)"
                    />
                  </div>
                  <div class="col-md-4">
                    <input-field
                        id="secondName"
                        label="Фамилия"
                        :warningMessage="secondNameWarningMessage"
                        v-model:inputValue="secondName"
                        :validationClass="validateTextField(secondName)"
                    />
                  </div>
                  <div class="col-md-4">
                    <input-field
                        id="phone"
                        label="Телефон"
                        :warningMessage="phoneWarningMessage"
                        v-model:inputValue="phone"
                        :validationClass="validatePhoneField(phone)"
                    />
                  </div>
                  <div class="col-12 buttons justify-content">
                    <div v-if="!this.isFormInEditingMode && !this.isFormSubmitted" class="col">
                      <button name="add" class="btn btn-primary">Добавить</button>
                    </div>
                    <div v-else-if="!this.isFormInEditingMode && this.isFormSubmitted" class="col">
                      <button name="cancel" class="btn btn-secondary me-2" @click="cancel">Отменить</button>
                      <button name="add" class="btn btn-primary">Добавить</button>
                    </div>
                    <div v-else class="col">
                      <button name="cancel" class="btn btn-secondary me-2" @click="cancel">Отменить</button>
                      <button name="save" class="btn btn-primary">Сохранить</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-6">
              <search-field
                  v-model:searchValue="searchString"
              />
            </div>
          </div>

          <div class="row table-responsive">
            <contacts-list
                :contacts="foundContacts"
                @remove="removeContact"
                @edit="editContact"
            />
          </div>`
    })

    .component("inputField", {
        props: {
            id: String,
            label: String,
            warningMessage: String,
            inputValue: String,
            validationClass: String
        },

        methods: {
            updateInput(event) {
                this.$emit("update:inputValue", event.target.value);
            }
        },

        template: `
          <div class="col">
            <label :for="id" class="form-label">{{ label }}</label>
            <input
                :id
                type="text"
                :value="inputValue"
                @input="updateInput"
                class="form-control"
                :class="validationClass"
            >
            <div class="invalid-feedback">
              {{ warningMessage }}
            </div>
          </div>`
    })

    .component("searchField", {
        props: {
            searchValue: String
        },

        methods: {
            updateSearchValue(event) {
                this.$emit("update:searchValue", event.target.value);
            },

            clearSearchValue() {
                this.$emit("update:searchValue", "");
            }
        },

        template: `
          <div class="search_form input-group">
            <input
                type="text"
                class="form-control"
                placeholder="Поиск"
                :value="searchValue"
                @input="updateSearchValue"
            >
            <button @click="clearSearchValue" class="clear_search_button btn btn-outline-secondary" type="button">Очистить</button>
          </div>`
    })

    .component("contactsList", {
        props: {
            contacts: {
                type: Array,
                required: true
            },
        },

        emits: ["remove", "edit"],

        template: `
          <h3>Список контактов</h3>
          <table class="table table-primary table-hover table-striped">
            <thead>
            <tr>
              <th scope="col" class="col">#</th>
              <th scope="col" class="col-md-4">Имя</th>
              <th scope="col" class="col-md-4">Фамилия</th>
              <th scope="col" class="col-md-4">Телефон</th>
              <th scope="col" class="col"></th>
            </tr>
            </thead>
            <tbody id="contact_list">
            <contact-item
                v-for="(contact, index) in contacts"
                :contact="contact"
                :key="contact.id"
                :index
                @remove="$emit('remove', contact)"
                @edit="$emit('edit', contact)"
            />
            </tbody>
          </table>`
    })

    .component("contactItem", {
        props: {
            contact: {
                type: Object,
                required: true
            },

            index: Number
        },

        template: `
          <tr>
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ contact.firstName }}</td>
            <td>{{ contact.secondName }}</td>
            <td>{{ contact.phone }}</td>
            <td>
              <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-primary" type="button" @click="$emit('edit', contact)">Edit</button>
                <button class="btn btn-danger" type="button" @click="$emit('remove', contact)">Delete</button>
              </div>
            </td>
          </tr>`
    })

    .component("modalDialog", {
        props: {
            header: {
                type: String,
                required: true
            },

            message: {
                type: String,
                required: true
            }
        },

        template: `
          <div class="modal fade" id="edit_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="modal_label">{{ header }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id="modal_body" class="modal-body" v-html="message"></div>
                <div class="modal-footer">
                  <button id="abort_button" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Нет</button>
                  <button id="confirm_button" type="button" class="btn btn-primary">Да</button>
                </div>
              </div>
            </div>
          </div>`
    })
    .mount("#app");