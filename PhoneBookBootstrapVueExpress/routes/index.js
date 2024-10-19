const express = require('express');
const {params} = require("express/lib/request");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

let contacts = [];
let currentContactId = 1;

router.get("/api/contacts", function (req, res) {
    // Вытаскиваем строку запроса /api/contacts?term=text
    const searchString = (req.query.searchString || "").toUpperCase();

    const result = searchString.length === 0
        ? contacts
        : contacts.filter(c => c.name.toUpperCase().includes(searchString)
            || c.family.toUpperCase().includes(searchString)
            || c.phone.toUpperCase().includes(searchString));
    // Передаем данные и они преобразуются в JSON.
    res.send(result);
});

router.delete("/api/contacts/:id", function (req, res) {
    const id = Number(req.params.id);

    contacts = contacts.filter(c => c.id !== id);

    res.send({
        success: true,
        message: null
    });
});

router.put("/api/contacts/:id", function (req, res) {
    const editedContactId = Number(req.params.id);
    const savedContact = contacts.find(contact => contact.id === editedContactId);

    const forSaveContact = {
        name: req.body.name,
        family: req.body.family,
        phone: req.body.phone
    };

    savedContact.name = forSaveContact.name;
    savedContact.family = forSaveContact.family;
    savedContact.phone = forSaveContact.phone;

    res.send({
        success: true,
        message: null
    });
});

router.post("/api/contacts", function (req, res) {
    const contact = {
        name: req.body.name,
        family: req.body.family,
        phone: req.body.phone
    };

    // TODO: Валидация.
    if (!contact.name) {
        res.send({
            success: false,
            message: "Поле 'name' обязательно."
        });

        return;
    }

    if (!contact.family) {
        res.send({
            success: false,
            message: "Поле 'family' обязательно."
        });

        return;
    }

    if (!contact.phone) {
        res.send({
            success: false,
            message: "Поле 'phone' обязательно."
        });

        return;
    }

    const upperCasePhone = contact.phone.toUpperCase();

    if (contacts.some(c => c.phone.toUpperCase() === upperCasePhone)) {
        res.send({
            success: false,
            message: "Такой телефон уже есть."
        });

        return;
    }

    contact.id = currentContactId;
    currentContactId++;

    contacts.push(contact);

    res.send({
        success: true,
        message: null
    });
});

module.exports = router;