"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const converterForm = document.getElementById("converter_form");
    const errorElement = document.querySelector(".error"); // берем элемент ошибки;

    const celsiusField = document.getElementById("celsius");
    const kelvinsField = document.getElementById("kelvins");
    const fahrenheitsField = document.getElementById("fahrenheits");

    converterForm.addEventListener("submit", function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.

        celsiusField.classList.remove("red");
        errorElement.style.display = "none"; // обнуление предыдущей ошибки;

        const celsiusString = celsiusField.value.trim().replace(',', '.');

        if (celsiusString.length === 0 || isNaN(celsiusString)) {
            celsiusField.classList.add("red");
            errorElement.style.display = "block";
            return;
        }

        kelvinsField.value = getKelvins(+celsiusString);
        fahrenheitsField.value = getFahrenheits(+celsiusString);
    });

    function getKelvins(celsius) {
        return celsius + 273.15;
    }

    function getFahrenheits(celsius) {
        return celsius * 9 / 5 + 32;
    }
});