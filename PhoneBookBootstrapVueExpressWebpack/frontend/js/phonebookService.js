import axios from "axios";

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

export default class PhoneBookService {
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
};