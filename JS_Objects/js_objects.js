"use strict";

(function () {
    // 1. Создайте массив объектов-стран (пусть будет несколько стран).
    const countries = [
        {
            name: "Россия",
            cities: [
                { name: "Москва", population: 15e6 },
                { name: "Санкт-Петербург", population: 5e6 },
                { name: "Новосибирск", population: 1.6e6 },
                { name: "Красноярск", population: 0.9e6 },
                { name: "Екатеринбург", population: 1.5e6 }
            ]
        },
        {
            name: "США",
            cities: [
                { name: "New-York", population: 20e6 },
                { name: "Los-Andgeles", population: 15e6 },
                { name: "Dallas", population: 1.3e6 },
                { name: "Boston", population: 0.6e6 },
                { name: "Detroit", population: 0.6e6 }
            ]
        },
        {
            name: "Франция",
            cities: [
                { name: "Paris", population: 2.1e6 },
                { name: "Marsel", population: 0.8e6 },
                { name: "Nice", population: 0.4e6 },
                { name: "Liyon", population: 0.5e6 }
            ]
        }
    ];

    function getCountriesWithMaxCitiesAmount(countries) {
        const maxCitiesAmount = countries.reduce((citiesAmount, e) =>
            Math.max(citiesAmount, e.cities.length), 0);

        return countries.filter(e => (e.cities.length === maxCitiesAmount))
            .map(e => (e.name + " - " + e.cities.length))
            .join("\n");
    }

    function getCountriesPopulations(countries) {
        const countriesPopulations = {}; // пустой объект;

        countries.forEach(
            e => (countriesPopulations[e.name] = // создаем поле на лету с названием страны;
                e.cities.reduce((countriesPopulations, e) => countriesPopulations + e.population, 0))
        );

        return countriesPopulations;
    }

    // 2. Страна/страны с максимальным количеством городов.
    console.log("Страны с максимальным числом городов:");
    console.log(getCountriesWithMaxCitiesAmount(countries));
    console.log("=============");

    // 3. Объект с информацией по всем странам такого вида:
    // ключ – название страны, значение – суммарная численность по стране.
    const countriesPopulations = getCountriesPopulations(countries);

    // Выводим поля и их значения у объекта.
    console.log("Страны и их население:");
    console.log(countriesPopulations);

    for (let country in countriesPopulations) {
        console.log(`${country} - ${countriesPopulations[country]}`);
    }
})();