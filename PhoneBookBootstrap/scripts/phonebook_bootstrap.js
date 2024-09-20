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
    let enteredContact = null;

    const contactForm = $(".contact_form");
    const editDialog = $("#edit_modal");

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

    // ===== События. ================================================================================================
    // async - возвращает Promis.
    contactForm.submit(async function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.

        if (checkFormValidity()) {
            const submitButtonPressed = e.originalEvent.submitter.name;

            // Запоминаем введенные данные, находящиеся в форме.
            enteredContact = getEnteredContact();
            const contactData = getContactInfo(enteredContact);

            if (submitButtonPressed === "add") {
                // await - можно использовать только внутри async-функций.
                const confirmed = await isConfirmed(editDialog, "Добавить контакт?", contactData);

                if (confirmed) {
                    editDialog.modal('hide');
                    addNewContact(enteredContact);
                    resetSearch();
                    resetContactForm();
                }

                viewContacts(allContacts);
            } else if (submitButtonPressed === "save") {
                const confirmed = await isConfirmed(editDialog, "Сохранить контакт?", contactData);

                if (confirmed) {
                    editDialog.modal('hide');

                    // Тут приходится сохранять как в "БД" (allContacts), так в текущей выборки (contacts = foundContacts).
                    // Как в таких случаях правилно поступить?
                    // Может сохранять всегда в первоисточнике, а на вывод повесить постоянный фильтр:
                    // типа viewContacts(contacts.filteredBy(searchString)); ?
                    // Аналогично в коде удаления контакта.
                    if (allContacts.length === foundContacts.length) {
                        // TODO: Можно добавить проверку на одинаковость контактов, если нет изменений, то и сохранять не надо.
                        saveContact(editedContactId, allContacts, enteredContact);
                        viewContacts(allContacts);
                    } else {
                        saveContact(editedContactId, allContacts, enteredContact);
                        saveContact(editedContactId, foundContacts, enteredContact);
                        viewContacts(foundContacts);
                    }

                    resetContactForm();
                } else {
                    // Возвращаем в форму прежние данные контакта.
                    setContactForm(editedContact);
                }
            }
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
        resetContactForm();
    });

    searchField.on("input", function () {
        searchString = searchField.val().trim().toLowerCase();

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

    // ===== Функции. ================================================================================================
    function viewContacts(contacts) {
        contactList.html(""); // обнуление списка;

        if (contacts.length === 0) {
            return;
        }

        let contactOrderNumber = 1;

        for (let contactIndex in contacts) {
            const contactItem = $("<tr></tr>")
                .html('<th scope="row">' + contactOrderNumber++ + '</th>'
                    + "<td>" + contacts[contactIndex].firstName + "</td>"
                    + "<td>" + contacts[contactIndex].lastName + "</td>"
                    + "<td>" + contacts[contactIndex].phone + "</td>"
                    + '<td>\
                            <div class="btn-group btn-group-sm" role="group">\
                                <button type="button" class="edit_button btn btn-primary">\
                                    <i class="bi bi-pencil-square"></i>\
                                </button>\
                                <button type="button" class="delete_button btn btn-danger">\
                                    <i class="bi bi-trash"></i>\
                                </button>\
                            </div>\
                        </td>')
                .appendTo(contactList);

            contactItem.find(".edit_button").click(function () {
                editContact(contacts[contactIndex].id);
            });

            contactItem.find(".delete_button").click(async function () {
                // Стоит ли этот кусок с await-функцией вынести в отдельную функцию и оставить только ее вызов?
                // Чтобы не занимало память, ведь контактов может быть много.
                const contactData = getContactInfo(contacts[contactIndex]);
                const confirmed = await isConfirmed(editDialog, "Удалить контакт?", contactData);

                if (confirmed) {
                    editDialog.modal('hide');
                    const deletedContactId = contacts[contactIndex].id;

                    if (allContacts.length === contacts.length) {
                        deleteContact(allContacts, deletedContactId);
                    } else {
                        deleteContact(contacts, deletedContactId);
                        deleteContact(allContacts, deletedContactId);
                    }

                    resetContactForm();
                    viewContacts(contacts);
                }
            });
        }
    }

    // Получение-установка данных контакта. --------------------------------------------------------------------------
    function getEnteredContact() {
        return {
            id: 0,
            firstName: dangerSymbolsEscape(firstNameField.val().trim()),
            lastName: dangerSymbolsEscape(lastNameField.val().trim()),
            phone: dangerSymbolsEscape(phoneField.val().trim())
        }
    }

    function setContactForm(contact) {
        firstNameField.val(contact[0].firstName);
        lastNameField.val(contact[0].lastName);
        phoneField.val(contact[0].phone);
    }

    function getContactInfo(contact) {
        return '<strong>' + contact.firstName + ' ' + contact.lastName + '</strong></br>телефон: ' + contact.phone;
    }

    // Добавление, удаление, редактирование, сохранение. -------------------------------------------------------------
    function addNewContact(contact) {
        const newContact = Object.assign({}, contact);
        newContact.id = ++currentId;

        allContacts.push(newContact);
    }

    function deleteContact(contacts, id) {
        const deletedContactIndex = contacts.findIndex(contact => contact.id === id);
        contacts.splice(deletedContactIndex, 1);
    }

    function editContact(id) {
        resetContactForm();

        hideButton(addButton);
        showButton(saveButton);
        cancelButton.show();

        editedContact = allContacts.filter(contact => contact.id === id);
        editedContactId = id;

        setContactForm(editedContact);
    }

    function saveContact(id, contactsArray, contactFormData) {
        const savedContact = contactsArray.find(contact => contact.id === id);

        savedContact.firstName = contactFormData.firstName;
        savedContact.lastName = contactFormData.lastName;
        savedContact.phone = contactFormData.phone;
    }

    // Валидация. ----------------------------------------------------------------------------------------------------
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

    const dangerSymbolsEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&lsquo;'
    };

    function dangerSymbolsEscape(inputString) {
        return inputString.replace(/[&<>"']/g, symbol => dangerSymbolsEscapes[symbol]);
    };

    // Почему тут можно убрать async и ошибки не будет?
    async function isConfirmed(dialog, dialogLabel, dialogMessage) {
        return new Promise(function (resolve, reject) {
            dialog.find("#modal_label").html(dialogLabel);
            dialog.find("#modal_body").html(dialogMessage);

            const confirmButton = editDialog.find("#confirm_button");
            const abortButton = editDialog.find("#abort_button");
            dialog.modal('show');

            dialog.on('hide.bs.modal', function () {
                resolve(false);
            });

            // Убил на этот off() полдня!
            // Если я отказывался добавлять контакт, то обработчик кнопки "да" в пямяти оставался.
            // При добавлении контакта вновь, создавался второй обработчик кнопки "да".
            // И вот они оба срабатывали, наконец: текущий добалял контакт, а предыдущий пустой контакт.
            // Два раза заходило в if (confirmed) {...}

            // Может стоит удалять обработчики еще других местах? В каких?
            confirmButton.off().click(function () {
                resolve(true);
            });

            // Оставить этот код? Вроде кнопка приводит к закрытитю, а закрытие к false и данное событие лишнее.
            abortButton.off().click(function () {
                resolve(false);
            });
        });
    }

    // Сброс, поиск. -------------------------------------------------------------------------------------------------
    function resetContactForm() {
        showButton(addButton);
        hideButton(saveButton);
        cancelButton.hide();

        contactForm.find("input.form-control").each(function () {
            $(this).removeClass("is-invalid");
            $(this).removeClass("is-valid");
            $(this).val("");
            $(this).blur();
        });
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

    resetContactForm();
    viewContacts(allContacts);
});