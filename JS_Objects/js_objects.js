"use strict";

let russia = {
    name: "Россия",
    cities: [
        { city_name: "Москва", population: 15e6 },
        { city_name: "Санкт-Петербург", population: 5e6 },
        { city_name: "Новосибирск", population: 1.6e6 },
        { city_name: "Красноярск", population: 0.9e6 },
        { city_name: "Екатеринбург", population: 1.5e6 }
    ]
};

let usa = {
    name: "США",
    cities: [
        { city_name: "New-York", population: 20e6 },
        { city_name: "Los-Andgeles", population: 15e6 },
        { city_name: "Dallas", population: 1.3e6 },
        { city_name: "Boston", population: 0.6e6 },
        { city_name: "Detroit", population: 0.6e6 }
    ]
};

let france = {
    name: "Франция",
    cities: [
        { city_name: "Paris", population: 2.1e6 },
        { city_name: "Marsel", population: 0.8e6 },
        { city_name: "Nice", population: 0.4e6 },
        { city_name: "Liyon", population: 0.5e6 }
    ]
};

let countries = [russia, usa, france];

// 1. Страна/страны с максимальным количеством городов.
(function () {
    let cities_max_amount = countries.reduce(function (cities_amount, current) {
        return Math.max(cities_amount, current.cities.length);
    }, 0);

    let countries_with_cities_max_amount = "";

    countries.filter(function (country) {
        return country.cities.length === cities_max_amount;
    }).map(function (country) {
        return country.name + " - " + country.cities.length; // получили массив;
    }).forEach(function (item) {
        return countries_with_cities_max_amount += item + "\n";
    });

    console.log("Страны с максимальным числом городов: " + "\n" + countries_with_cities_max_amount);
})();

// 2. Объект с информацией по всем странам такого вида:
// ключ – название страны, значение – суммарная численность по стране.
let countries_population = new Object(); // пустой объект;

countries.forEach(function (country) {
    countries_population[country.name] = country["cities"].reduce(function (total_population, current) {
        return total_population + current["population"];
    }, 0);
});

countries_population["Некая страна"] = "100500"; // получается можно и так добавлять, не только через точку?

// Выводим поля и их значения у объекта.
console.log("\n" + "Страны и их население:");
for (let key in countries_population) {
    console.log(key + " - " + countries_population[key]);
};