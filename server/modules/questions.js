require('dotenv').config();
const fetch = require('node-fetch'),
  key = process.env.KEY;

const questions = {
  questionone: {
    cityone: {
      city: 'Amsterdam',
      country: 'Nederland',
    },
    citytwo: {
      city: 'Londen',
      country: 'Verenigd Koninkrijk',
    },
  },
};

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
  const response = await fetch(url);
  const data = await response.json();
  const temp = data.main.temp,
    name = data.name;
  return { temp, name };
}

// * main.temp
// * name

// outcome:

// {
//   coord: { lon: 5.39, lat: 52.16 },
//   weather: [ { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' } ],
//   base: 'stations',
//   main: {
//     temp: 27.21,
//     feels_like: 28.18,
//     temp_min: 26.67,
//     temp_max: 28.33,
//     pressure: 1023,
//     humidity: 47
//   },
//   wind: { speed: 0.87, deg: 19 },
//   clouds: { all: 0 },
//   dt: 1592924687,
//   sys: {
//     type: 3,
//     id: 265546,
//     country: 'NL',
//     sunrise: 1592882274,
//     sunset: 1592942606
//   },
//   timezone: 7200,
//   id: 2759821,
//   name: 'Amersfoort',
//   cod: 200
// }

module.exports = { questions, getWeather };