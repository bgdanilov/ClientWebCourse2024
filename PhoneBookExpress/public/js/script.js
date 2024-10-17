function executeGet(url, data) {
    return axios.get(url, {
        params: data
    }).then(response => response.data);
}

function executePost(url, data) {
    return axios.post(url, data).then(response => response.data);
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
}

Vue.createApp({
    data() {
        return {
            contacts: [],
            term: "",
            name: "",
            phone: "",
            service: new PhoneBookService()
        }
    },

    // Подгружаем контакты в момент создания компонента.
    created() {
        this.loadContacts();
    },

    methods: {
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
    }
}).mount("#app");