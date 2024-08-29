"use strict";

(function () {
    function getDescendingSortedArray(arrayOfNumbers) {
        return array.slice().sort((e1, e2) => e2 - e1);
    }

    function getFirstFiveItems(array) {
        return array.slice(0, 5);
    }

    function getLastFiveItems(array) {
        return array.slice(-5);
    }

    function getEvenNumbersSum(array) {
        return getEvenNumbers(array).reduce((sum, item) => sum + item, 0);
    }

    function getEvenNumbersSquares(array) {
        return getEvenNumbers(array).map(e => e * e);
    }

    function getEvenNumbers(array) {
        return array.filter(e => e % 2 === 0);
    }

    // 1. Создайте массив чисел.
    const array = [2, 5, 1, 0, 7, 12, 9];
    console.log("Исходный массив: " + array);

    // 1.1. Сортировка по убыванию.
    console.log("Новый массив в порядке убывания: " + getDescendingSortedArray(array));

    // 1.2. Подмассив из первых 5 элементов.
    console.log("Подмассив из первых 5 элементов: " + getFirstFiveItems(array));

    // 1.3. Подмассив из последних 5 элементов.
    console.log("Подмассив из последних 5 элементов: " + getLastFiveItems(array));

    // 1.4. Сумма элементов массива, которые являются четными числами.
    console.log("Сумма элементов массива, которые являются четными числами: " + getEvenNumbersSum(array));

    // 2. Создайте массив чисел от 1 до 100, в таком порядке.
    const numbers = [];

    for (let i = 1; i <= 100; i++) {
        numbers.push(i);
    }

    // 2.1. Получите список квадратов четных чисел из этого массива.
    console.log("Список квадратов четных чисел из массива чисел 1 - 100: " + getEvenNumbersSquares(numbers));
})();