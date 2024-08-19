"use strict";

const errorElement = document.querySelector(".red"); // берем элемент ошибки;
const convertButton = document.querySelector(".convert_button"); // берем кнопку конвертации;

const celsiusField = document.getElementById("celsius");
const kelvinsField = document.getElementById("kelvins");
const fahrenheitsField = document.getElementById("fahrenheits");

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        celsiusField.addEventListener("click", function (e) {
            errorElement.style.display = 'none'; // обнуление предыдущей ошибки;
            celsiusField.className = "temperature";
        });

        convertButton.addEventListener("click", function (e) {
            const celsius = parseFloat(celsiusField.value);

            if (isNumber(celsius)) {
                kelvinsField.value = getKelvins(celsius);
                fahrenheitsField.value = getFahrenheits(celsius);
            } else {
                celsiusField.className = "temperature red";
                errorElement.style.display = 'block';
            };
        });
    });
})();

function getKelvins(celsius) {
    return celsius + 273.15;
};

function getFahrenheits(celsius) {
    return celsius * 9 / 5 + 32;
};

function isNumber(value) {
    if (isNaN(value) || typeof (value) !== "number") {
        return false;
    }

    return true;
};