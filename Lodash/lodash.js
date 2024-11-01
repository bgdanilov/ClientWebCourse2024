"use strict";

(function () {
    const persons = [
        {name: "Bob", age: 17},
        {name: "Dude", age: 37},
        {name: "Cris", age: 21},
        {name: "Cris", age: 25},
        {name: "Alex", age: 71},
        {name: "Martin", age: 45},
        {name: "John", age: 14},
        {name: "Phil", age: 38},
        {name: "Arnold", age: 6},
        {name: "Jane", age: 20},
        {name: "Katrine", age: 32},
        {name: "Katrine", age: 29},
    ];

    function getAverageAge(personsArray) {
        return _.meanBy(personsArray, "age");
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
            .map(person => person.name)
            .uniq()
            .sort((e1, e2) => {
                if (e2 > e1) {
                    return 1;
                }

                if (e2 < e1) {
                    return -1;
                }

                return 0;
            })
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