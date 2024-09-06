"use strict";

(function () {
    function sortArrayDescending(numbersArray) {
        return numbersArray.sort((e1, e2) => e2 - e1);
    }

    function getFirstItems(array, itemsAmount) {
        return array.slice(0, itemsAmount);
    }

    function getLastItems(array, itemsAmount) {
        return array.slice(-itemsAmount);
    }

    function getEvenNumbersSum(numbersArray) {
        return getEvenNumbers(numbersArray).reduce((sum, item) => sum + item, 0);
    }

    function getEvenNumbersSquares(numbersArray) {
        return getEvenNumbers(numbersArray).map(e => e * e);
    }

    function getEvenNumbers(numbersArray) {
        return numbersArray.filter(e => e % 2 === 0);
    }

    // 1. Создайте массив чисел.
    const numbersArray = [2, 5, 1, 0, 7, 12, 9];
    console.log("Исходный массив: " + numbersArray);

    // 1.1. Сортировка по убыванию.
    console.log("Массив в порядке убывания: " + sortArrayDescending(numbersArray));

    // 1.2. Подмассив из первых 5 элементов.
    console.log("Подмассив из первых 5 элементов: " + getFirstItems(numbersArray, 5));

    // 1.3. Подмассив из последних 5 элементов.
    console.log("Подмассив из последних 5 элементов: " + getLastItems(numbersArray, 5));

    // 1.4. Сумма элементов массива, которые являются четными числами.
    console.log("Сумма элементов массива, которые являются четными числами: " + getEvenNumbersSum(numbersArray));

    // 2. Создайте массив чисел от 1 до 100, в таком порядке.
    const numbers = [];

    for (let i = 1; i <= 100; i++) {
        numbers.push(i);
    }

    // 2.1. Получите список квадратов четных чисел из этого массива.
    console.log("Список квадратов четных чисел из массива чисел 1 - 100: " + getEvenNumbersSquares(numbers));
})();