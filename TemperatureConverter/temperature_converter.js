"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const converterForm = document.getElementById("converter_form");
    const errorElement = document.querySelector(".error"); // берем элемент ошибки;

    const celsiusField = document.getElementById("celsius");
    const kelvinsField = document.getElementById("kelvins");
    const fahrenheitsField = document.getElementById("fahrenheits");

    converterForm.addEventListener("submit", function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.

        const celsius = parseFloat(celsiusField.value.trim());

        celsiusField.classList.remove("red");
        errorElement.style.display = "none"; // обнуление предыдущей ошибки;

        if (isNaN(celsius) || typeof(value) !== "number") {
            celsiusField.classList.add("red");
            errorElement.style.display = "block";
            return;
        }

        kelvinsField.value = getKelvins(celsius);
        fahrenheitsField.value = getFahrenheits(celsius);
    });

    function getKelvins(celsius) {
        return celsius + 273.15;
    }

    function getFahrenheits(celsius) {
        return celsius * 9 / 5 + 32;
    }
});