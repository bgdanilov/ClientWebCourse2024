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

    getContacts(term) {
        return executeGet(this.baseUrl, {term});
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
                term: "",
                name: "",
                phone: "",
                service: new PhoneBookService(),

                isEditingMode: false,
                editedContactId: ""
            }
        },

        // Подгружаем контакты в момент создания компонента.
        created() {
            this.loadContacts();
        },

        methods: {
            onSubmitted(event) {
                const submitButton = event.submitter.name;

                if (submitButton === "add") {
                    this.createContact();
                } else if (submitButton === "save") {
                    this.saveContact();
                }
            },

            createContact() {
                const contact = {
                    name: this.name,
                    phone: this.phone
                };

                this.service.createContact(contact).then(response => {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    this.name = "";
                    this.phone = "";

                    this.loadContacts();
                }).catch(() => alert("Не удалось создать контакт."));
            },

            editContact(contact) {
                this.isEditingMode = true;
                this.editedContactId = contact.id;

                this.name = contact.name;
                this.phone = contact.phone;
            },

            saveContact() {
                const contact = {
                    name: this.name,
                    phone: this.phone
                };

                this.service.saveContact(this.editedContactId, contact).then(response => {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    this.name = "";
                    this.phone = "";
                    this.isEditingMode = false;

                    this.loadContacts();
                }).catch(() => alert("Не удалось сохранить контакт."));
            },

            delContact(contact) {
                this.service.deleteContact(contact.id).then(response => {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    this.loadContacts();
                }).catch(() => alert("Не удалось удалить контакт."));
            },

            // Передаем строку запроса, получаем контакты, в случае успеха кладем их в поле contacts [].
            loadContacts() {
                this.service.getContacts(this.term).then(contacts => {
                    this.contacts = contacts;
                }).catch(() => alert("Не удалось загрузить контакты."));
            }
        },

        template: `
          <h1>Phones</h1>
          
          <contact-form
              @submitted="onSubmitted"
              :isEditingMode
              v-model:inputNameValue="name"
              v-model:inputPhoneValue="phone"
          />
          
         <!--<form @submit.prevent="loadContacts" class="mb-3">
            <h2 class="h5">Поиск:</h2>

            <div class="row row-cols-lg-auto g-3">
              <div class="col-12">
                <input v-model="term" type="text" class="form-control" placeholder="Поиск">
              </div>
              <div class="col-12">
                <button class="btn btn-primary me-2">Поиск</button>
              </div>
            </div>
          </form> -->

          <div class="table-responsive">
            <contacts-list
                :contacts
                @delete="delContact"
                @edit="editContact"
            />
          </div>`
    })

    .component("contactForm", {
        props: {
            inputNameValue: String,
            inputPhoneValue: String,
            isEditingMode: Boolean
        },

        data() {
          return {

          }
        },

        methods: {
            // Почему-то если событие называлось submit, то дважды отправлялся post?
            // Пришлось назвать submitted.
            onSubmit(event) {
                this.$emit("submitted", event);
            },

            updateName(event) {
                this.$emit("update:inputNameValue", event.target.value);
            },

            updatePhone(event) {
                this.$emit("update:inputPhoneValue", event.target.value);
            }
        },

        template: `
            <form @submit.prevent="onSubmit" class="mb-3">
                <h2 class="h5">Добавить контакт</h2>
    
                <div class="row row-cols-lg-auto g-3">
                  <div class="col-12">
                    <input
                        @input="updateName"
                        :value="inputNameValue"
                        type="text"
                        class="form-control"
                        placeholder="Имя">
                  </div>
                  <div class="col-12">
                    <input 
                        @input="updatePhone"
                        :value="inputPhoneValue"
                        type="text"
                        class="form-control"
                        placeholder="Телефон">
                  </div>
                  <div v-if="!isEditingMode" class="col-12">
                    <button name="add" class="btn btn-primary me-2">Создать</button>
                  </div>
                  <div v-else class="col-12">
                    <button name="save" class="btn btn-primary me-2">Сохранить</button>
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
              <th>№</th>
              <th>Имя</th>
              <th>Телефон</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(contact, index) in contacts" :key="contact.id">
              <td v-text="index + 1"></td>
              <td v-text="contact.name"></td>
              <td v-text="contact.phone"></td>
              <td>
                <button @click="$emit('delete', contact)" class="btn btn-danger me-2" type="button">Удалить</button>
                <button @click="$emit('edit', contact)" class="btn btn-primary" type="button">Редактировать</button>
              </td>
            </tr>
            </tbody>
          </table>`
    })
    .mount("#app");