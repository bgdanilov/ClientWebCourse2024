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

        if (!!celsius) {
            kelvinsField.value = getKelvins(celsius);
            fahrenheitsField.value = getFahrenheits(celsius);
            return;
        };

        celsiusField.classList.add("red");
        errorElement.style.display = "block";
    });

    function getKelvins(celsius) {
        return celsius + 273.15;
    }

    function getFahrenheits(celsius) {
        return celsius * 9 / 5 + 32;
    }
});