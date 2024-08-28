"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact_form");

    const findField = document.getElementById("find");

    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const phoneField = document.getElementById("phone");

    const addButton = contactForm.querySelector(".add_button");
    const newButton = contactForm.querySelector(".new_button");
    const saveButton = contactForm.querySelector(".save_button");
    const editButton = contactForm.querySelector(".edit_button");
    const deleteButton = contactForm.querySelector(".delete_button");

    const contactList = document.querySelector(".contact_list");
    let allContacts = [
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

    let editedId;

    addButton.setAttribute("type", "submit");

    addButton.classList.remove("none");
    newButton.classList.add("none");
    editButton.classList.add("none");
    deleteButton.classList.add("none");
    saveButton.classList.add("none");

    findField.addEventListener("input", function() {
        let wantedString = findField.value.trim();
        let findedContacts = allContacts.filter(e => (e.firstName.indexOf(wantedString) === 0 || e.lastName.indexOf(wantedString) === 0));
        
        printContacts(findedContacts);
        viewContact(findedContacts, findedContacts[0].phone);
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
        deleteContact(editedId);
    });

    editButton.addEventListener("click", function () {
        editContact();
    });

    function printContacts(array) {
        contactList.innerHTML = ''; // обнуление списка;

        if (array.length !== 0) {
            for (let i in array) {
                const contactItem = document.createElement("li");
                contactItem.innerHTML = `
                <span class="contact_item_name"></span>
            `;

                contactList.append(contactItem);

                contactItem.querySelector(".contact_item_name")
                    .textContent = `${array[i]["lastName"]} ${array[i]["firstName"]}`;

                // Навешиваем редактирование.
                contactItem.querySelector(".contact_item_name").addEventListener("click", function () {
                    let selected = contactList.querySelectorAll("ul > li");

                    for (let item of selected) {
                        item.classList.remove("selected");
                    }

                    contactItem.classList.add("selected");
                    viewContact(array, array[i].phone);
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

        allContacts.push(contact);
        resetForm();
        printContacts(allContacts);
    }

    function saveContact() {
        if (isFieldsEmpty(firstNameField.value, lastNameField.value, phoneField.value)) {
            return;
        };

        let editedContact = allContacts.find(item => item.phone === editedId);

        editedContact.firstName = firstNameField.value;
        editedContact.lastName = lastNameField.value;
        editedContact.phone = phoneField.value;
        viewContact(allContacts, editedId);
        printContacts(allContacts);
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

    function deleteContact(id) {
        let deletedIndex = allContacts.findIndex(item => item.phone === id);
        allContacts.splice(deletedIndex, 1);
        resetForm();
        printContacts(allContacts);
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

    function viewContact(array, phone) {
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

        let viewedContact = array.filter(e => (e.phone === phone));

        firstNameField.value = viewedContact[0].firstName;
        lastNameField.value = viewedContact[0].lastName;
        phoneField.value = viewedContact[0].phone;

        console.log(viewedContact);

        editedId = phone;
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

    printContacts(allContacts);
});