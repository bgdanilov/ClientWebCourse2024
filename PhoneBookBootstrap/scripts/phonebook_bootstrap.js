'use strict'

$(function () {
    let allContacts = [
        {
            id: 1,
            firstName: "Boris",
            lastName: "Danilov",
            phone: "121"
        },
        {
            id: 2,
            firstName: "Ivan",
            lastName: "Ivanov",
            phone: "345525342"
        },
        {
            id: 3,
            firstName: "Ivan",
            lastName: "Petrov",
            phone: "345342"
        },
        {
            id: 4,
            firstName: "Valily",
            lastName: "Ignatiev",
            phone: "3-5325342"
        },
        {
            id: 5,
            firstName: "Petr",
            lastName: "Ivanov",
            phone: "3435-325342"
        },
        {
            id: 6,
            firstName: "Ivan",
            lastName: "Ivanov",
            phone: "3545 5334534"
        },
        {
            id: 7,
            firstName: "Konstantin",
            lastName: "Ivanov",
            phone: "1-325342"
        },
        {
            id: 8,
            firstName: "Brad",
            lastName: "Pitt",
            phone: "34-23424-43"
        }
    ];

    let currentId = 8;
    let editedContactId;
    let editedContact = null;

    const contactForm = $(".contact_form");

    const searchForm = $(".search_form");
    const searchField = searchForm.find("input.form-control");
    const clearSearchButton = searchForm.find("button.clear_search_button");

    let searchString;
    let foundContacts;

    const firstNameField = $("#firstName");
    const lastNameField = $("#lastName");
    const phoneField = $("#phone");

    const addButton = contactForm.find("#add_button");
    const saveButton = contactForm.find("#save_button");
    const cancelButton = contactForm.find("#cancel_button");

    const contactList = $("#contact_list");

    // ===== События. ===========================================================================================
    searchField.on("input", function () {
        searchString = searchField.val().trim().toLowerCase();

        console.log(searchString);

        foundContacts = allContacts
            .filter(contact => (contact.firstName.toLowerCase().indexOf(searchString) === 0
                || contact.lastName.toLowerCase().indexOf(searchString) === 0
                || contact.phone.toLowerCase().indexOf(searchString) === 0));

        viewContacts(foundContacts);
    });

    clearSearchButton.click(function () {
        resetSearch();
        viewContacts(allContacts);
    });

    contactForm.submit(function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.

        if (checkFormValidity()) {
            const submitButtonPressed = e.originalEvent.submitter.name;

            if (submitButtonPressed === "add") {
                addNewContact();
            } else if (submitButtonPressed === "save") {
                saveContact(editedContactId);
            }

            resetForm();
            viewContacts(allContacts);
        }
    });

    firstNameField.on("input", function () {
        checkFieldForEmpty(firstNameField);
    });

    lastNameField.on("input", function () {
        checkFieldForEmpty(lastNameField);
    });

    phoneField.on("input", function () {
        checkPhoneField(phoneField);
    });

    cancelButton.click(function () {
        resetForm();
    });

    // ===== Функции. =======================================================================================
    function viewContacts(contactsArray) {
        contactList.html(""); // обнуление списка;

        if (contactsArray.length === 0) {
            return;
        }

        let contactOrderNumber = 1;

        for (let contactIndex in contactsArray) {
            const contactItem = $("<tr></tr>")
                .html('<th scope="row">' + contactOrderNumber++ + '</th>'
                    + "<td>" + contactsArray[contactIndex].firstName + "</td>"
                    + "<td>" + contactsArray[contactIndex].lastName + "</td>"
                    + "<td>" + contactsArray[contactIndex].phone + "</td>"
                    + '<td>\
                                <div class="btn-group btn-group-sm" role="group">\
                                    <button type="button" class="edit_button btn btn-primary">\
                                        <i class="bi bi-pencil-square"></i>\
                                    </button>\
                                    <button type="button" class="delete_button btn btn-primary">\
                                        <i class="bi bi-trash"></i>\
                                    </button>\
                                </div>\
                            </td>')
                .appendTo(contactList);

            contactItem.find(".edit_button").click(function () {
                editContact(contactsArray[contactIndex].id);
            });

            contactItem.find(".delete_button").click(function () {
                deleteContact(contactsArray[contactIndex].id);
                resetForm();
                viewContacts(allContacts);
            });
        }
    }

    function addNewContact() {
        const firstName = badSymbolsEscape(firstNameField.val().trim());
        const lastName = badSymbolsEscape(lastNameField.val().trim());
        const phone = badSymbolsEscape(phoneField.val().trim());

        let contact = {
            id: ++currentId,
            firstName: firstName,
            lastName: lastName,
            phone: phone
        };

        allContacts.push(contact);
    }

    function deleteContact(id) {
        let deletedContactIndex = allContacts
            .findIndex(contact => contact.id === id);

        allContacts.splice(deletedContactIndex, 1);
    }

    function editContact(id) {
        resetForm();

        editedContact = allContacts.filter(contact => contact.id === id);
        editedContactId = id;

        hideButton(addButton);
        showButton(saveButton);

        firstNameField.val(editedContact[0].firstName);
        lastNameField.val(editedContact[0].lastName);
        phoneField.val(editedContact[0].phone);
    }

    function saveContact(id) {
        const firstName = badSymbolsEscape(firstNameField.val().trim());
        const lastName = badSymbolsEscape(lastNameField.val().trim());
        const phone = badSymbolsEscape(phoneField.val().trim());

        const savedContact = allContacts.find(contact => contact.id === id);

        savedContact.firstName = firstName;
        savedContact.lastName = lastName;
        savedContact.phone = phone;
    }

    function resetForm() {
        showButton(addButton);
        hideButton(saveButton);
        cancelButton.show();

        contactForm.find("input.form-control").each(function () {
            $(this).removeClass("is-invalid");
            $(this).removeClass("is-valid");
            $(this).val("");
            $(this).blur();
        });
    }

    function isPhoneAlreadyExist(phone) {
        return allContacts.find(item => item.phone.trim() === phone);
    }

    function checkFieldForEmpty(field) {
        const string = field.val().trim();

        if (string.length === 0) {
            field.removeClass("is-valid");
            field.addClass("is-invalid");
        } else {
            field.removeClass("is-invalid");
            field.addClass("is-valid");
        }
    }

    function checkPhoneField(field) {
        const string = field.val().trim();

        if (isPhoneAlreadyExist(string)) {
            if (editedContact === null || string !== editedContact[0].phone) {
                field.removeClass("is-valid");
                field.addClass("is-invalid");
                field.next().text("Такой телефон уже есть.");
            }
        } else {
            field.next().text("Пожалуйста, введите телефон.");
            checkFieldForEmpty(field);
        }
    }

    function checkFormValidity() {
        checkFieldForEmpty(firstNameField);
        checkFieldForEmpty(lastNameField);
        checkPhoneField(phoneField);

        return !firstNameField.hasClass("is-invalid")
            && !lastNameField.hasClass("is-invalid")
            && !phoneField.hasClass("is-invalid");
    }

    function hideButton(button) {
        button.prop("type", "button");
        button.hide();
    }

    function showButton(button) {
        button.prop("type", "submit");
        button.show();
    }

    function resetSearch() {
        searchField.val("");
    }

    const badSymbolsEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&lsquo;'
    };

    function badSymbolsEscape(string) {
        return string.replace(/[&<>"']/g, symbol => badSymbolsEscapes[symbol]);
    };

    resetForm();
    viewContacts(allContacts);
});