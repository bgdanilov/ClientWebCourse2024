"use strict";

$(function () {
    const contactForm = $("#contact_form");
    const searchField = $("#search");
    const cancelIcon = $("#cancel_search");

    const firstNameField = $("#firstName");
    const lastNameField = $("#lastName");
    const phoneField = $("#phone");

    const addButton = $("#add_button");
    const newButton = $("#new_button");
    const saveButton = $("#save_button");
    const editButton = $("#edit_button");
    const deleteButton = $("#delete_button");

    const contactList = $(".contact_list");

    let allContactsArray = [
        {
            id: "1",
            firstName: "Boris",
            lastName: "Danilov",
            phone: "121"
        },
        {
            id: "2",
            firstName: "Ivan",
            lastName: "Ivanov",
            phone: "345525342"
        },
        {
            id: "3",
            firstName: "Ivan",
            lastName: "Petrov",
            phone: "345342"
        },
        {
            id: "4",
            firstName: "Valily",
            lastName: "Ignatiev",
            phone: "3-5325342"
        },
        {
            id: "5",
            firstName: "Petr",
            lastName: "Ivanov",
            phone: "3435-325342"
        },
        {
            id: "6",
            firstName: "Ivan",
            lastName: "Ivanov",
            phone: "3545 5334534"
        },
        {
            id: "7",
            firstName: "Konstantin",
            lastName: "Ivanov",
            phone: "1-325342"
        },
        {
            id: "8",
            firstName: "Brad",
            lastName: "Pitt",
            phone: "34-23424-43"
        }
    ];

    let currentId = 8;
    let selectedContactId;

    addButton.attr("type", "submit");

    newButton.hide();
    editButton.hide();
    deleteButton.hide();
    saveButton.hide();
    cancelIcon.hide();

    let searchString;
    let findedContactsArray;

    // ===== События. ===========================================================================================
    searchField.on("input", function () {
        cancelIcon.show();
        searchString = searchField.val().trim().toLowerCase();

        // TODO как-то заменить на аналог JQuerry?
        findedContactsArray = allContactsArray
            .filter(contact => (contact.firstName.toLowerCase().indexOf(searchString) === 0
                || contact.lastName.toLowerCase().indexOf(searchString) === 0));

        printContacts(findedContactsArray);
    });

    cancelIcon.click(function () {
        resetSearch();
        printContacts(allContactsArray);
    });

    contactForm.submit(function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.
        const submitButtonPressed = e.originalEvent.submitter.name;

        if (submitButtonPressed === "add") {
            addNewContact();
        } else if (submitButtonPressed === "save") {
            saveContact();
        }
    });

    newButton.click(function () {
        const selectedContactItem = $("ul > li.selected");

        //const selectedContactItem = contactList.querySelector("ul > li.selected");
        // как мне выбрать $("ul > li.selected") от contactList, а не от $ ?
        // не искать по всему документу?
        // Что-то типа contactList("ul > li.selected"), а не $("ul > li.selected");

        if (selectedContactItem !== null) {
            selectedContactItem.removeClass("selected");
        }

        resetForm();
    });

    saveButton.click(function () {
        saveContact();
    });

    deleteButton.click(function () {
        deleteContact();
    });

    editButton.click(function () {
        editContact();
    });

    // ===== Функции. =======================================================================================
    function printContacts(contactsArray) {
        contactList.html(""); // обнуление списка;

        if (contactsArray.length !== 0) {
            for (let contactIndex in contactsArray) {
                const contactItem = $("<li></li>")
                    .html(contactsArray[contactIndex].lastName + " " + contactsArray[contactIndex].firstName)
                    .click(function () {
                        $("ul.contact_list li").each(function () {  // получаем список всех li в contact_list;
                            $(this).removeClass("selected");
                        });

                        $(this).addClass("selected");

                        selectedContactId = contactsArray[contactIndex].id;
                        viewContact(contactsArray, selectedContactId);
                    }).appendTo(contactList);

                if (contactsArray[contactIndex].id === selectedContactId) {
                    contactItem.addClass("selected");
                }
            }
        }
    }

    function addNewContact() {
        const firstName = firstNameField.val().trim();
        const lastName = lastNameField.val().trim();
        const phone = phoneField.val().trim();

        if (isFieldsEmpty(firstName, lastName, phone)) {
            firstNameField.val(firstName);
            lastNameField.val(lastName);
            phoneField.val(phone);
            return;
        };

        if (isPhoneAlreadyExist(phone)) {
            phoneField.addClass("invalid");
            return;
        }

        let contact = {
            id: ++currentId,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        };

        allContactsArray.push(contact);
        console.log(currentId);

        resetForm();
        resetSearch();

        selectedContactId = currentId;

        viewContact(allContactsArray, currentId);
        printContacts(allContactsArray);
    }

    function saveContact() {
        const firstName = firstNameField.val().trim();
        const lastName = lastNameField.val().trim();
        const phone = phoneField.val().trim();

        if (isFieldsEmpty(firstName, lastName, phone)) {
            firstNameField.val(firstName);
            lastNameField.val(lastName);
            phoneField.val(phone);
            return;
        };

        const selectedContact = allContactsArray.find(contact => contact.id === selectedContactId);

        if (isPhoneAlreadyExist(phone) && phone !== selectedContact.phone) { // чтобы не ругался на свой же телефон;
            phoneField.addClass("invalid");
            return;
        }

        const savedContact = allContactsArray.find(contact => contact.id === selectedContactId);

        savedContact.firstName = firstName;
        savedContact.lastName = lastName;
        savedContact.phone = phone;

        // Обновляем в списке контактов изменения.
        $("li.selected").html(lastName + " " + firstName);
        viewContact(allContactsArray, selectedContactId);
    }

    function resetForm() {
        addButton.attr("type", "submit");
        saveButton.removeAttr("type", "submit");

        addButton.show();
        newButton.hide();
        editButton.hide();
        deleteButton.hide();
        saveButton.hide();

        firstNameField.prop("disabled", false);
        lastNameField.prop("disabled", false);
        phoneField.prop("disabled", false);

        firstNameField.removeClass("view invalid");
        lastNameField.removeClass("view invalid");
        phoneField.removeClass("view invalid");

        firstNameField.val("");
        lastNameField.val("");
        phoneField.val("");
    }

    function deleteContact() {
        let deletedContactIndex = allContactsArray
            .findIndex(contact => contact.id === selectedContactId);

        allContactsArray.splice(deletedContactIndex, 1);

        resetSearch();
        resetForm();
        printContacts(allContactsArray);
    }

    function editContact() {
        addButton.removeAttr("type", "submit");
        saveButton.attr("type", "submit");

        addButton.hide();
        newButton.hide();
        editButton.hide();
        deleteButton.hide();
        saveButton.show();

        firstNameField.prop("disabled", false);
        lastNameField.prop("disabled", false);
        phoneField.prop("disabled", false);

        firstNameField.removeClass("view");
        lastNameField.removeClass("view");
        phoneField.removeClass("view");
    }

    function viewContact(contactsArray, contactId) {
        addButton.hide();
        newButton.show();
        editButton.show();
        deleteButton.show();
        saveButton.hide();

        firstNameField.prop("disabled", true);
        lastNameField.prop("disabled", true);
        phoneField.prop("disabled", true);

        firstNameField.removeClass("invalid");
        lastNameField.removeClass("invalid");
        phoneField.removeClass("invalid");

        firstNameField.addClass("view");
        lastNameField.addClass("view");
        phoneField.addClass("view");

        let viewedContact = contactsArray.filter(contact => contact.id === contactId);

        firstNameField.val(viewedContact[0].firstName);
        lastNameField.val(viewedContact[0].lastName);
        phoneField.val(viewedContact[0].phone);
    }

    function isFieldsEmpty(field1Value, field2Value, field3Value) {
        firstNameField.toggleClass("invalid", field1Value.length === 0);
        lastNameField.toggleClass("invalid", field2Value.length === 0);
        phoneField.toggleClass("invalid", field3Value.length === 0);

        if (field1Value.length === 0 || field2Value.length === 0 || field3Value.length === 0) {
            return true;
        }
    }

    function isPhoneAlreadyExist(phone) {
        return allContactsArray.find(item => item.phone.trim() === phone);
    }

    function resetSearch() {
        searchField.val("");
        cancelIcon.hide();
    }

    printContacts(allContactsArray);
});


// Выбираю,например, все input.invalid:
// $("input.invalid") - будет массив
// как мне всем выбраннным навесить одинаковое событие?