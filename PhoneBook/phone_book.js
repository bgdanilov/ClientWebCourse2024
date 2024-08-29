"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact_form");

    const searchField = document.getElementById("search");

    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const phoneField = document.getElementById("phone");

    const addButton = contactForm.querySelector(".add_button");
    const newButton = contactForm.querySelector(".new_button");
    const saveButton = contactForm.querySelector(".save_button");
    const editButton = contactForm.querySelector(".edit_button");
    const deleteButton = contactForm.querySelector(".delete_button");

    const contactList = document.querySelector(".contact_list");

    let allContactsArray = [
        {
            firstName: "Boris",
            lastName: "Danilov",
            phone: "12132425"
        },
        {
            firstName: "Ivan",
            lastName: "Ivanov",
            phone: "345525342"
        },
        {
            firstName: "Ivan",
            lastName: "Petrov",
            phone: "345342"
        },
        {
            firstName: "Valily",
            lastName: "Ignatiev",
            phone: "3-5325342"
        },
        {
            firstName: "Petr",
            lastName: "Ivanov",
            phone: "3435-325342"
        },
        {
            firstName: "Ivan",
            lastName: "Ivanov",
            phone: "3545 5334534"
        },
        {
            firstName: "Konstantin",
            lastName: "Ivanov",
            phone: "1-325342"
        },
        {
            firstName: "Brad",
            lastName: "Pitt",
            phone: "34-23424-43"
        }
    ];

    let phoneOfEditedContact;

    addButton.setAttribute("type", "submit");

    addButton.classList.remove("none");
    newButton.classList.add("none");
    editButton.classList.add("none");
    deleteButton.classList.add("none");
    saveButton.classList.add("none");

    let wantedString;
    let findedContactsArray;

    searchField.addEventListener("input", function () {
        wantedString = searchField.value.trim().toLowerCase();

        findedContactsArray = allContactsArray.filter(e =>
        (e.firstName.toLowerCase().indexOf(wantedString) === 0
            || e.lastName.toLowerCase().indexOf(wantedString) === 0));

        printContacts(findedContactsArray);
        viewContact(findedContactsArray, findedContactsArray[0].phone);
    });

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.
        addNewContact();
    });

    newButton.addEventListener("click", function () {
        resetForm();
    });

    saveButton.addEventListener("click", function () {
        saveContact();
    });

    deleteButton.addEventListener("click", function () {
        deleteContact(phoneOfEditedContact);
    });

    editButton.addEventListener("click", function () {
        editContact();
    });

    function printContacts(contactsArray) {
        contactList.innerHTML = ''; // обнуление списка;

        if (contactsArray.length !== 0) {
            for (let contact in contactsArray) {
                const contactItem = document.createElement("li");
                contactItem.innerHTML = `
                <span class="contact_item_name"></span>
            `;

                contactList.append(contactItem);

                contactItem.querySelector(".contact_item_name")
                    .textContent = `${contactsArray[contact]["lastName"]} ${contactsArray[contact]["firstName"]}`;

                // Навешиваем редактирование.
                contactItem.querySelector(".contact_item_name").addEventListener("click", function () {
                    let selectedContactItems = contactList.querySelectorAll("ul > li");

                    for (let item of selectedContactItems) {
                        item.classList.remove("selected");
                    }

                    contactItem.classList.add("selected");
                    viewContact(contactsArray, contactsArray[contact].phone);
                });
            }
        }
    }

    function addNewContact() {
        let firstName = firstNameField.value.trim();
        let lastName = lastNameField.value.trim();
        let phone = phoneField.value.trim();

        if (isFieldsEmpty(firstName, lastName, phone)) {
            return;
        };

        let contact = {
            firstName: firstName,
            lastName: lastName,
            phone: phone
        };

        allContactsArray.push(contact);
        resetForm();
        printContacts(allContactsArray);
    }

    function saveContact() {
        if (isFieldsEmpty(firstNameField.value, lastNameField.value, phoneField.value)) {
            return;
        };

        let editedContact = allContactsArray.find(item => item.phone === phoneOfEditedContact);

        editedContact.firstName = firstNameField.value;
        editedContact.lastName = lastNameField.value;
        editedContact.phone = phoneField.value;

        phoneOfEditedContact = phoneField.value;

        viewContact(allContactsArray, phoneOfEditedContact);
        printContacts(allContactsArray);
    }

    function resetForm() {
        addButton.setAttribute("type", "submit");

        addButton.classList.remove("none");
        newButton.classList.add("none");
        editButton.classList.add("none");
        deleteButton.classList.add("none");
        saveButton.classList.add("none");

        firstNameField.removeAttribute("disabled");
        lastNameField.removeAttribute("disabled");
        phoneField.removeAttribute("disabled");

        firstNameField.classList.remove("view", "invalid");
        lastNameField.classList.remove("view", "invalid");
        phoneField.classList.remove("view", "invalid");

        firstNameField.value = "";
        lastNameField.value = "";
        phoneField.value = "";
    }

    function deleteContact(phone) {
        let deletedContactIndex = allContactsArray.findIndex(item => item.phone === phone);
        allContactsArray.splice(deletedContactIndex, 1);
        resetForm();
        printContacts(allContactsArray);
    }

    function editContact() {
        addButton.removeAttribute("type", "submit");

        addButton.classList.add("none");
        newButton.classList.add("none");
        editButton.classList.add("none");
        deleteButton.classList.remove("none");
        saveButton.classList.remove("none");

        firstNameField.removeAttribute("disabled");
        lastNameField.removeAttribute("disabled");
        phoneField.removeAttribute("disabled");

        firstNameField.classList.remove("view");
        lastNameField.classList.remove("view");
        phoneField.classList.remove("view");
    }

    function viewContact(contactsArray, phone) {
        addButton.classList.add("none");
        newButton.classList.remove("none");
        editButton.classList.remove("none");
        deleteButton.classList.add("none");
        saveButton.classList.add("none");

        firstNameField.setAttribute("disabled", "true");
        lastNameField.setAttribute("disabled", "true");
        phoneField.setAttribute("disabled", "true");

        firstNameField.classList.add("view");
        lastNameField.classList.add("view");
        phoneField.classList.add("view");

        firstNameField.classList.remove("invalid");
        lastNameField.classList.remove("invalid");
        phoneField.classList.remove("invalid");

        let viewedContact = contactsArray.filter(e => e.phone === phone);

        firstNameField.value = viewedContact[0].firstName;
        lastNameField.value = viewedContact[0].lastName;
        phoneField.value = viewedContact[0].phone;

        phoneOfEditedContact = phone;
    }

    function isFieldsEmpty(field1Value, field2Value, field3Value) {
        if (field1Value.length === 0) {
            firstNameField.classList.add("invalid");
            firstNameField.placeholder = "Введите имя!";
        } else {
            firstNameField.classList.remove("invalid");
            firstNameField.placeholder = "Имя";
        }

        if (field2Value.length === 0) {
            lastNameField.classList.add("invalid");
            lastNameField.placeholder = "Введите фамилию!";
        } else {
            lastNameField.classList.remove("invalid");
            lastNameField.placeholder = "Фамилия";
        }

        if (field3Value.length === 0) {
            phoneField.classList.add("invalid");
            phoneField.placeholder = "Введите телефон!";
        } else {
            phoneField.classList.remove("invalid");
            phoneField.placeholder = "Телефон";
        }

        if (field1Value.length === 0 || field2Value.length === 0 || field3Value.length === 0) {
            return true;
        }
    }

    printContacts(allContactsArray);
});