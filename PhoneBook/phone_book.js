"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact_form");
    const searchField = document.getElementById("search");
    const cancelIcon = document.getElementById("cancel_search");

    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const phoneField = document.getElementById("phone");

    const addButton = document.getElementById("add_button");
    const newButton = document.getElementById("new_button");
    const saveButton = document.getElementById("save_button");
    const editButton = document.getElementById("edit_button");
    const deleteButton = document.getElementById("delete_button");

    const contactList = document.querySelector(".contact_list");

    let allContactsArray = [
        {
            firstName: "Boris",
            lastName: "Danilov",
            phone: "121"
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

    let phoneOfSelectedContact;

    addButton.setAttribute("type", "submit");

    newButton.classList.add("none");
    editButton.classList.add("none");
    deleteButton.classList.add("none");
    saveButton.classList.add("none");
    cancelIcon.classList.add("none");

    let searchString;
    let findedContactsArray;

    searchField.addEventListener("input", function () {
        cancelIcon.classList.remove("none");

        searchString = searchField.value.trim().toLowerCase();

        findedContactsArray = allContactsArray.filter(e =>
        (e.firstName.toLowerCase().indexOf(searchString) === 0
            || e.lastName.toLowerCase().indexOf(searchString) === 0));


        printContacts(findedContactsArray);
    });

    cancelIcon.addEventListener("click", function () {
        resetSearch();
        printContacts(allContactsArray);
    });

    contactForm.addEventListener("submit", function (e) {
        //console.log(e.submitter.value);
        e.preventDefault(); // чтобы не перезагружалась страница.
        addNewContact();
    });

    newButton.addEventListener("click", function () {
        const selectedContactItem = contactList.querySelector("ul > li.selected");

        if (selectedContactItem !== null) {
            selectedContactItem.classList.remove("selected");
        }

        phoneOfSelectedContact = null;
        resetForm();
    });

    saveButton.addEventListener("click", function () {
        saveContact();
    });

    deleteButton.addEventListener("click", function () {
        deleteContact(phoneOfSelectedContact);
    });

    editButton.addEventListener("click", function () {
        editContact();
    });

    function printContacts(contactsArray) {
        contactList.innerHTML = ''; // обнуление списка;

        if (contactsArray.length !== 0) {
            for (let contact in contactsArray) {
                const contactItem = document.createElement("li");
                contactList.append(contactItem);

                contactItem.textContent
                    = `${contactsArray[contact]["lastName"]} ${contactsArray[contact]["firstName"]}`;

                if (contactsArray[contact]["phone"] === phoneOfSelectedContact) {
                    contactItem.classList.add("selected");
                }

                // Навешиваем редактирование.
                contactItem.addEventListener("click", function () {
                    let selectedContactItems = contactList.querySelectorAll("ul > li");

                    for (let item of selectedContactItems) {
                        item.classList.remove("selected");
                    }

                    contactItem.classList.add("selected");
                    viewContact(contactsArray, contactsArray[contact].phone);

                    phoneOfSelectedContact = contactsArray[contact].phone;
                });
            }
        }
    }

    function addNewContact() {
        const firstName = firstNameField.value.trim();
        const lastName = lastNameField.value.trim();
        const phone = phoneField.value.trim();

        if (isFieldsEmpty(firstName, lastName, phone)) {
            return;
        };

        if (isPhoneAlreadyExist(phone)) {
            phoneField.classList.add("invalid");
            return;
        }

        let contact = {
            firstName: firstName,
            lastName: lastName,
            phone: phone
        };

        allContactsArray.push(contact);

        phoneOfSelectedContact = phone;

        resetForm();
        resetSearch();

        viewContact(allContactsArray, phoneOfSelectedContact);
        printContacts(allContactsArray);
    }

    function saveContact() {
        if (isFieldsEmpty(firstNameField.value, lastNameField.value, phoneField.value)) {
            return;
        };

        if (isPhoneAlreadyExist(phoneField.value) && phoneField.value !== phoneOfSelectedContact) {
            phoneField.classList.add("invalid");
            return;
        }

        let editedContact = allContactsArray.find(item => item.phone === phoneOfSelectedContact);

        editedContact.firstName = firstNameField.value;
        editedContact.lastName = lastNameField.value;
        editedContact.phone = phoneField.value;

        phoneOfSelectedContact = phoneField.value;

        viewContact(allContactsArray, phoneOfSelectedContact);
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

    // Todo?
    function deleteContact(phone) {
        let deletedContactIndex = allContactsArray.findIndex(item => item.phone === phone);
        allContactsArray.splice(deletedContactIndex, 1);
        resetSearch();
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

        phoneOfSelectedContact = phone;
    }

    function isFieldsEmpty(field1Value, field2Value, field3Value) {
        if (field1Value.length === 0) {
            firstNameField.classList.add("invalid");
        } else {
            firstNameField.classList.remove("invalid");
        }

        if (field2Value.length === 0) {
            lastNameField.classList.add("invalid");
        } else {
            lastNameField.classList.remove("invalid");
        }

        if (field3Value.length === 0) {
            phoneField.classList.add("invalid");
        } else {
            phoneField.classList.remove("invalid");
        }

        if (field1Value.length === 0 || field2Value.length === 0 || field3Value.length === 0) {
            return true;
        }
    }

    function isPhoneAlreadyExist(phone) {
        return allContactsArray.find(item => item.phone.trim() === phone);
    }

    function resetSearch() {
        searchField.value = "";
        cancelIcon.classList.add("none");
    }

    printContacts(allContactsArray);
});