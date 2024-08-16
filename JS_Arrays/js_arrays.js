"use strict";

const array = [2, 5, 1, 0, 7, 12, 9];

(function () {
    console.log("Исходный массив: " + array);

    // 1. Сортировка по убыванию.
    let sorted = Array.from(array);
    sorted.sort(function (a, b) {
        return b - a;
    });

    console.log("Массив в порядке убывания: " + sorted);
    console.log("Исходный массив: " + array);

    // 2.1. Подмассив из первых 5 элементов.
    let first_five_numbers = Array.from(array).slice(0, 5);
    console.log("Подмассив из первых 5 элементов: " + first_five_numbers

    );

    // 2.2. Подмассив из последних 5 элементов.
    let last_five_numbers = Array.from(array).slice(array.length - 5);
    console.log("Подмассив из последних 5 элементов: " + last_five_numbers);

    // 3. Сумма элементов массива, которые являются четными числами.
    let even_numbers = get_even_numbers(array);

    let even_numbers_summ = 0;
    even_numbers.forEach(function (e) {
        even_numbers_summ += e;
    });

    console.log("Сумма элементов массива, которые являются четными числами: " + even_numbers_summ);
})();

(function () {
    // Список квадратов четных чисел из массива чисел 1 - 100.
    let numbers = [];

    for (let i = 1; i <= 100; i++) {
        numbers.push(i);
    }

    let even_numbers_squares = get_even_numbers(numbers).map(function (e) {
        return e * e;
    });

    console.log("Список квадратов четных чисел из массива чисел 1 - 100: " + even_numbers_squares);
})();

function get_even_numbers(array) {
    return array.filter(function (a) {
        return a % 2 === 0;
    });
};