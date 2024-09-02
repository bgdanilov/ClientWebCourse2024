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
        const maxCitiesAmount = countries.reduce((citiesAmount, country) => Math.max(citiesAmount, country.cities.length), 0);

        return countries.filter(country => country.cities.length === maxCitiesAmount);
    }

    function getCountriesPopulation(countries) {
        const countriesPopulation = {}; // пустой объект;

        // А где тут фигурные скобки можно применить?
        countries.forEach(
            // создаем поле на лету с названием страны;
            country => countriesPopulation[country.name]
                = country.cities.reduce((countryPopulation, city) => countryPopulation + city.population, 0)
        );

        return countriesPopulation;
    }

    // 2. Страна/страны с максимальным количеством городов.
    const countriesWithMaxCitiesAmount = getCountriesWithMaxCitiesAmount(countries);

    console.log("Страны с максимальным числом городов:");
    console.log(countriesWithMaxCitiesAmount);

    console.log(countriesWithMaxCitiesAmount
        .map(country => country.name + " - " + country.cities.length)
        .join("\n"));

    console.log("=============");

    // 3. Объект с информацией по всем странам такого вида:
    // ключ – название страны, значение – суммарная численность по стране.
    const countriesPopulation = getCountriesPopulation(countries);

    // Выводим поля и их значения у объекта.
    console.log("Страны и их население:");
    console.log(countriesPopulation);

    for (const country in countriesPopulation) {
        console.log(`${country} - ${countriesPopulation[country]}`);
    }
})();