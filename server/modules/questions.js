require('dotenv').config();
const fetch = require('node-fetch'),
  key = process.env.KEY;

const questions = {
  question1: {
    cityone: {
      city: 'Amsterdam',
      country: 'Nederland',
      img:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/1599px-Flag_of_the_Netherlands.svg.png',
    },
    citytwo: {
      city: 'Londen',
      country: 'Verenigd Koninkrijk',
      img:
        'https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/1600px-Flag_of_the_United_Kingdom.svg.png',
    },
  },
  question2: {
    cityone: {
      city: 'Warschau',
      country: 'Polen',
      img:
        'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/2560px-Flag_of_Poland.svg.png',
    },
    citytwo: {
      city: 'Brussel',
      country: 'België',
      img:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/1920px-Flag_of_Belgium.svg.png',
    },
  },
  question3: {
    cityone: {
      city: 'Moskou',
      country: 'Rusland',
      img:
        'https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/1920px-Flag_of_Russia.svg.png',
    },
    citytwo: {
      city: 'Tokyo',
      country: 'Japan',
      img:
        'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Flag_of_Japan.svg/1599px-Flag_of_Japan.svg.png',
    },
  },
  question4: {
    cityone: {
      city: 'Brasilia',
      country: 'Brazilië',
      img:
        'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
    },
    citytwo: {
      city: 'Nuuk',
      country: 'Groenland',
      img:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
    },
  },
  // question5: {
  //   cityone: {
  //     city: 'Brasilia',
  //     country: 'Brazilië',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
  //   },
  //   citytwo: {
  //     city: 'Nuuk',
  //     country: 'Groenland',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
  //   },
  // },
  // question6: {
  //   cityone: {
  //     city: 'Brasilia',
  //     country: 'Brazilië',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
  //   },
  //   citytwo: {
  //     city: 'Nuuk',
  //     country: 'Groenland',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
  //   },
  // },
  // question7: {
  //   cityone: {
  //     city: 'Brasilia',
  //     country: 'Brazilië',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
  //   },
  //   citytwo: {
  //     city: 'Nuuk',
  //     country: 'Groenland',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
  //   },
  // },
  // question8: {
  //   cityone: {
  //     city: 'Brasilia',
  //     country: 'Brazilië',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
  //   },
  //   citytwo: {
  //     city: 'Nuuk',
  //     country: 'Groenland',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
  //   },
  // },
  // question9: {
  //   cityone: {
  //     city: 'Brasilia',
  //     country: 'Brazilië',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
  //   },
  //   citytwo: {
  //     city: 'Nuuk',
  //     country: 'Groenland',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
  //   },
  // },
  // question10: {
  //   cityone: {
  //     city: 'Brasilia',
  //     country: 'Brazilië',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
  //   },
  //   citytwo: {
  //     city: 'Nuuk',
  //     country: 'Groenland',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
  //   },
  // },
  // question11: {
  //   cityone: {
  //     city: 'Brasilia',
  //     country: 'Brazilië',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/1440px-Flag_of_Brazil.svg.png',
  //   },
  //   citytwo: {
  //     city: 'Nuuk',
  //     country: 'Groenland',
  //     img:
  //       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_Greenland.svg/1920px-Flag_of_Greenland.svg.png',
  //   },
  // },
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
