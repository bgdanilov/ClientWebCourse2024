import "bootstrap/dist/css/bootstrap.css";
import "../css/style.scss";

function executeGet(url, data) {
    return axios.get(url, {
        params: data
    }).then(response => response.data);
}

function executePost(url, data) {
    return axios.post(url, data).then(response => response.data);
}

function executeSave(url, data) {
    return axios.put(url, data).then(response => response.data);
}

function executeDelete(url) {
    return axios.delete(url).then(response => response.data);
}

class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/contacts"
    }

    getContacts(searchString) {
        return executeGet(this.baseUrl, {searchString});
    }

    deleteContact(id) {
        return executeDelete(`${this.baseUrl}/${id}`);
    }

    createContact(contact) {
        return executePost(this.baseUrl, contact);
    }

    saveContact(id, contact) {
        return executeSave(`${this.baseUrl}/${id}`, contact);
    }
}

Vue.createApp({})
    .component("phoneBook", {
        data() {
            return {
                contacts: [],
                name: "",
                family: "",
                phone: "",
                searchString: "",
                service: new PhoneBookService(),

                isEditingMode: false,
                editedContact: {},
                editedContactId: "",

                confirmModal: null,
                dialogTitle: "",
                dialogMessage: ""
            }
        },

        // Подгружаем контакты в момент создания компонента.
        created() {
            this.loadContacts();
        },

        mounted() {
            this.confirmModal = this.$refs.confirmModal;
        },

        methods: {
            onSubmitted(event) {
                const submitButton = event.submitter.name;

                if (submitButton === "add") {
                    this.createContact();
                } else if (submitButton === "save") {
                    // Просит .then()...
                    this.saveContact();
                }
            },

            createContact() {
                const contact = {
                    name: this.name,
                    family: this.family,
                    phone: this.phone
                };

                this.service.createContact(contact).then(response => {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    this.name = "";
                    this.family = "";
                    this.phone = "";

                    this.loadContacts();
                }).catch(() => alert("Не удалось создать контакт."));
            },

            editContact(contact) {
                this.isEditingMode = true;
                this.editedContact = contact;
                this.editedContactId = contact.id;

                this.name = contact.name;
                this.family = contact.family;
                this.phone = contact.phone;
            },

            async saveContact() {
                this.dialogTitle = "Сохранить изменения?"
                this.dialogMessage = this.name + " " + this.family + "</br> Телефон: " + this.phone;

                const isDialogConfirmed = await this.showModalDialog(this.confirmModal);

                if (isDialogConfirmed) {
                    this.confirmModal.hide();
                    const contact = {
                        name: this.name,
                        family: this.family,
                        phone: this.phone
                    };

                    this.service.saveContact(this.editedContactId, contact).then(response => {
                        if (!response.success) {
                            alert(response.message);
                            return;
                        }

                        this.name = "";
                        this.family = "";
                        this.phone = "";
                        this.isEditingMode = false;

                        this.loadContacts();
                    }).catch(() => alert("Не удалось сохранить контакт."));
                }
            },

            async deleteContact(contact) {
                this.dialogTitle = "Удалить контакт?"
                this.dialogMessage = contact.name + " " + contact.family + "</br> Телефон: " + contact.phone;

                const isDialogConfirmed = await this.showModalDialog(this.confirmModal);

                if (isDialogConfirmed) {
                    this.confirmModal.hide();

                    this.service.deleteContact(contact.id).then(response => {
                        if (!response.success) {
                            alert(response.message);
                            return;
                        }

                        this.searchString = "";
                        this.loadContacts();
                    }).catch(() => alert("Не удалось удалить контакт."));
                }
            },

            // Передаем строку запроса, получаем контакты, в случае успеха кладем их в поле contacts [].
            loadContacts(searchString) {
                this.service.getContacts(searchString).then(contacts => {
                    this.contacts = contacts;
                }).catch(() => alert("Не удалось загрузить контакты."));
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
              ref="confirmModal"
              :header="dialogTitle"
              :message="dialogMessage"
          />

          <h1>Телефонная книга</h1>

          <div v-if="!isEditingMode">
            <h2 class="h5">Добавить контакт</h2>
          </div>
          <div v-else>
            <h2 class="h5">Редактировать контакт</h2>
          </div>
          <contact-form
              @submitted="onSubmitted"
              :contacts
              :editedContact
              v-model:inputNameValue="name"
              v-model:inputFamilyValue="family"
              v-model:inputPhoneValue="phone"
              v-model:isEditingMode="isEditingMode"
          />

          <h2 class="h5">Поиск:</h2>
          <search-form
              @updateSearchString="loadContacts"
              v-model:inputSearchingStringValue="searchString"
          />

          <div class="table-responsive">
            <contacts-list
                :contacts
                @delete="deleteContact"
                @edit="editContact"
            />
          </div>`
    })

    .component("contactForm", {
        props: {
            inputNameValue: String,
            inputPhoneValue: String,
            inputFamilyValue: String,

            isEditingMode: Boolean,
            contacts: Array,
            editedContact: {}
        },

        data() {
            return {
                isFormSubmitted: false,
                invalidNameMessage: "Введите имя",
                invalidFamilyMessage: "Введите фамилию",
                invalidPhoneMessage: "Введите телефон"
            }
        },

        computed: {
            inputNameClass() {
                return this.getTextInputClass(this.inputNameValue);
            },

            inputFamilyClass() {
                return this.getTextInputClass(this.inputFamilyValue);
            },

            inputPhoneClass() {
                return this.getPhoneInputClass(this.inputPhoneValue);
            }
        },

        methods: {
            onSubmit(event) {
                this.isFormSubmitted = true;

                if (this.inputNameClass === "is-valid" &&
                    this.inputFamilyClass === "is-valid" &&
                    this.inputPhoneClass === "is-valid") {
                    this.$emit("submitted", event);
                    this.isFormSubmitted = false;
                }
            },

            updateName(event) {
                this.$emit("update:inputNameValue", event.target.value);
            },

            updateFamily(event) {
                this.$emit("update:inputFamilyValue", event.target.value);
            },

            updatePhone(event) {
                this.$emit("update:inputPhoneValue", event.target.value);
            },

            getTextInputClass(inputValue) {
                if (this.isFormSubmitted) {
                    return inputValue.trim() !== "" ? "is-valid" : "is-invalid";
                }

                return "";
            },

            getPhoneInputClass(inputValue) {
                if (this.isFormSubmitted) {
                    if (this.isPhoneAlreadyExist(inputValue) && this.editedContact.phone !== inputValue) {
                        this.invalidPhoneMessage = "Такой телефон уже есть"
                        return "is-invalid";
                    }

                    this.invalidPhoneMessage = "Введите телефон."
                    return inputValue.trim() !== "" ? "is-valid" : "is-invalid";
                }

                return "";
            },

            isPhoneAlreadyExist(phone) {
                return this.contacts.find(contact => contact.phone.trim() === phone);
            },

            clearContactForm() {
                this.$emit("update:inputNameValue", "");
                this.$emit("update:inputFamilyValue", "");
                this.$emit("update:inputPhoneValue", "");
                this.$emit("update:isEditingMode", false);
                this.isFormSubmitted = false;
            }
        },

        template: `
          <form @submit.prevent="onSubmit" class="mb-3">
            <div class="row">
              <div class="col-md-3">
                <input id="name" type="text" class="form-control" placeholder="Имя"
                       @input="updateName"
                       :value="inputNameValue"
                       :class="inputNameClass"
                />
                <div class="invalid-feedback" v-text="invalidNameMessage"></div>
              </div>
              <div class="col-md-3">
                <input id="family" type="text" class="form-control" placeholder="Фамилия"
                       @input="updateFamily"
                       :value="inputFamilyValue"
                       :class="inputFamilyClass"
                />
                <div class="invalid-feedback" v-text="invalidFamilyMessage"></div>
              </div>
              <div class="col-md-3">
                <input id="phone" type="text" class="form-control" placeholder="Телефон"
                       @input="updatePhone"
                       :value="inputPhoneValue"
                       :class="inputPhoneClass"
                />
                <div class="invalid-feedback" v-text="invalidPhoneMessage"></div>
              </div>
              <div v-if="!isEditingMode" class="col-md-3">
                <div v-if="this.inputNameValue.trim().length !== 0 ||
                           this.inputFamilyValue.trim().length !== 0 ||
                           this.inputPhoneValue.trim().length !== 0 ||
                           this.isFormSubmitted">
                  <button type="button" class="btn btn-secondary me-1" @click="clearContactForm">Отмена</button>
                  <button name="add" class="btn btn-primary">Создать</button>
                </div>
                <div v-else>
                  <button name="add" class="btn btn-primary">Создать</button>
                </div>
              </div>
              <div v-else class="col-md-3">
                <div v-if="this.inputNameValue.trim().length !== 0 ||
                           this.inputFamilyValue.trim().length !== 0 ||
                           this.inputPhoneValue.trim().length !== 0 ||
                           this.isFormSubmitted">
                  <button type="button" class="btn btn-secondary me-1" @click="clearContactForm">Отмена</button>
                  <button name="save" class="btn btn-primary">Сохранить</button>
                </div>
                <div v-else>
                  <button name="save" class="btn btn-primary">Сохранить</button>
                </div>
              </div>
            </div>
          </form>`
    })

    .component("searchForm", {
        props: {
            inputSearchingStringValue: String
        },

        methods: {
            updateSearchString(event) {
                this.$emit('updateSearchString', event.target.value);
                this.$emit("update:inputSearchingStringValue", event.target.value);
            },

            onSubmit(event) {
                event.preventDefault();
            },

            clearInput() {
                this.$emit('updateSearchString', "");
                this.$emit("update:inputSearchingStringValue", "");
            }
        },

        template: `
          <form @submit.prevent="onSubmit" class="mb-3">
            <div class="row">
              <div class="col-md-3">
                <input id="search" type="text" class="form-control" placeholder="Поиск"
                       @input="updateSearchString"
                       :value="inputSearchingStringValue"
                >
              </div>
              <div v-if="inputSearchingStringValue.trim().length !== 0" class="col-md-3">
                <button type="button" @click="clearInput" class="btn btn-secondary">Отмена</button>
              </div>
            </div>
          </form>`
    })

    .component("contactsList", {
        props: {
            contacts: {}
        },

        template: `
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
            <tbody>
            <tr v-for="(contact, index) in contacts" :key="contact.id">
              <td v-text="index + 1"></td>
              <td v-text="contact.name"></td>
              <td v-text="contact.family"></td>
              <td v-text="contact.phone"></td>
              <td>
                <div class="btn-group btn-group-sm" role="group">
                  <button @click="$emit('delete', contact)" class="btn btn-danger" type="button"><i
                      class="bi bi-trash"></i></button>
                  <button @click="$emit('edit', contact)" class="btn btn-primary" type="button"><i
                      class="bi bi-pencil-square"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>`
    })

    .component("modalDialog", {
        props: {
            header: {
                type: String,
                required: true,
            },

            message: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                dialog: null
            }
        },

        mounted() {
            this.dialog = new bootstrap.Modal(this.$refs.modal);
        },

        methods: {
            show() {
                this.dialog.show();
            },

            hide() {
                this.dialog.hide();
            }
        },

        template: `
          <div class="modal fade" ref="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="modal_label">{{ header }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div id="modal_body" class="modal-body" v-html="message"></div>
                <div class="modal-footer">
                  <button ref="abort_button" id="abort_button" type="button" class="btn btn-secondary"
                          data-bs-dismiss="modal">Нет
                  </button>
                  <button ref="confirm_button" id="confirm_button" type="button" class="btn btn-danger">Да</button>
                </div>
              </div>
            </div>
          </div>`
    })
    .mount("#app");