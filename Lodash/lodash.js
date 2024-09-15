"use strict";

(function () {
    const persons = [
        { name: "Bob", age: 17 },
        { name: "Chack", age: 37 },
        { name: "Cris", age: 21 },
        { name: "Cris", age: 25 },
        { name: "Alex", age: 71 },
        { name: "Martin", age: 45 },
        { name: "Jonh", age: 14 },
        { name: "Phill", age: 38 },
        { name: "Arnold", age: 6 },
        { name: "Jane", age: 20 },
        { name: "Katrine", age: 32 },
        { name: "Katrine", age: 29 }
    ];

    function getAverageAge(personsArray) {
        let totalAge = 0;
        _.forEach(personsArray, person => totalAge += person.age);

        return totalAge / personsArray.length;
    }

    function getPersonsFrom20To30SortedByAgeAscending(personsArray) {
        return _.chain(personsArray)
            .filter(person => person.age >= 20 && person.age <= 30)
            .sortBy("age")
            .value();
    }

    function getPersonsFrom20To30UniqueNamesDescending(personsArray) {
        return _.chain(personsArray)
            .filter(person => person.age >= 20 && person.age <= 30)
            .sort((e1, e2) => e2.name > e1.name ? 1 : -1)
            .uniqBy(person => person.name)
            .map(person => person.name)
            .value();
    }

    function getNamesWithPersonsAmount(personsArray) {
        return _.countBy(personsArray, "name");
    }

    // 1. Посчитать средний возраст всех людей.
    console.log("Средний возраст всех людей: " + getAverageAge(persons));

    // 2. Получить список людей с возрастом от 20 до 30 включительно,
    // отсортировать их по возрастанию возраста.
    console.log("Люди от 20 до 30 включительно по возрастанию возраста:");
    console.log(getPersonsFrom20To30SortedByAgeAscending(persons));

    // 3. Получить список уникальных имен людей с возрастом от 20 до 30 включительно, 
    // отсортировать его по убыванию.
    console.log("Список уникальных имен людей от 20 до 30 включительно по убыванию возраста:");
    console.log(getPersonsFrom20To30UniqueNamesDescending(persons));

    // 4. Получить объект, в котором ключами будут имена людей, а значениями – количество людей с этим именем.
    console.log("Объект, имена – количество людей с этим именем:");
    console.log(getNamesWithPersonsAmount(persons));
})();