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

    addButton.attr("type", "submit");

    newButton.hide();
    editButton.hide();
    deleteButton.hide();
    saveButton.hide();
    cancelIcon.hide();

    let searchString;
    let findedContactsArray;

    searchField.on("input", function () {
        cancelIcon.show();
        searchString = searchField.val().trim().toLowerCase();

        // TODO как-то заменить на аналог JQuerry?
        findedContactsArray = allContactsArray.filter(e =>
        (e.firstName.toLowerCase().indexOf(searchString) === 0
            || e.lastName.toLowerCase().indexOf(searchString) === 0));

        printContacts(findedContactsArray);
    });

    cancelIcon.click(function () {
        resetSearch();
        printContacts(allContactsArray);
    });

    contactForm.submit(function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница. Не надо?
        addNewContact();
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

        phoneOfSelectedContact = null;
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

    function printContacts(contactsArray) {
        contactList.html(""); // обнуление списка;

        if (contactsArray.length !== 0) {
            for (let contact in contactsArray) {
                const contactItem = $("<li></li>")
                    .html(contactsArray[contact].lastName + " " + contactsArray[contact].firstName)
                    .click(function () {
                        $("ul.contact_list li") // получаем список всех li в contact_list;
                            .each(function () {
                                $(this).removeClass("selected");
                            });

                        // contactItem.addClass("selected"); почему на contactItem не могу навесить?
                        $(this).addClass("selected");

                        phoneOfSelectedContact = contactsArray[contact].phone;
                        viewContact(contactsArray, phoneOfSelectedContact);
                    })
                    .appendTo(contactList);

                if (contactsArray[contact].phone === phoneOfSelectedContact) {
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
        const firstName = firstNameField.val().trim();
        const lastName = lastNameField.val().trim();
        const phone = phoneField.val().trim();

        if (isFieldsEmpty(firstName, lastName, phone)) {
            firstNameField.val(firstName);
            lastNameField.val(lastName);
            phoneField.val(phone);
            return;
        };

        if (isPhoneAlreadyExist(phone) && phone !== phoneOfSelectedContact) {
            phoneField.addClass("invalid");
            return;
        }

        let editedContact = allContactsArray.find(item => item.phone === phoneOfSelectedContact);

        editedContact.firstName = firstName;
        editedContact.lastName = lastName;
        editedContact.phone = phone;

        $("li.selected").html(lastName + " " + firstName);

        phoneOfSelectedContact = phone;
        viewContact(allContactsArray, phoneOfSelectedContact);
    }

    function resetForm() {
        addButton.attr("type", "submit");

        addButton.show();
        newButton.hide();
        editButton.hide();
        deleteButton.hide();
        saveButton.hide();

        firstNameField.removeAttr("disabled");
        lastNameField.removeAttr("disabled");
        phoneField.removeAttr("disabled");

        firstNameField.removeClass("view invalid");
        lastNameField.removeClass("view invalid");
        phoneField.removeClass("view invalid");

        firstNameField.val("");
        lastNameField.val("");
        phoneField.val("");
    }

    function deleteContact() {
        let deletedContactIndex = allContactsArray
            .findIndex(item => item.phone === phoneOfSelectedContact);

        allContactsArray.splice(deletedContactIndex, 1);

        resetSearch();
        resetForm();
        printContacts(allContactsArray);
    }

    function editContact() {
        addButton.removeAttr("type", "submit");
        // TODO: сделать замену submit;
        saveButton.attr("type", "submit");

        addButton.hide();
        newButton.hide();
        editButton.hide();
        deleteButton.show();
        saveButton.show();

        firstNameField.removeAttr("disabled");
        lastNameField.removeAttr("disabled");
        phoneField.removeAttr("disabled");

        firstNameField.removeClass("view");
        lastNameField.removeClass("view");
        phoneField.removeClass("view");
    }

    function viewContact(contactsArray, phone) {
        addButton.hide();
        newButton.show();
        editButton.show();
        deleteButton.hide();
        saveButton.hide();

        firstNameField.attr("disabled", "true");
        lastNameField.attr("disabled", "true");
        phoneField.attr("disabled", "true");

        firstNameField.addClass("view");
        lastNameField.addClass("view");
        phoneField.addClass("view");

        firstNameField.removeClass("invalid");
        lastNameField.removeClass("invalid");
        phoneField.removeClass("invalid");

        let viewedContact = contactsArray.filter(e => e.phone === phone);

        firstNameField.val(viewedContact[0].firstName);
        lastNameField.val(viewedContact[0].lastName);
        phoneField.val(viewedContact[0].phone);

        phoneOfSelectedContact = phone;
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