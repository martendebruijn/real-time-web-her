require('dotenv').config();
const express = require('express'),
  router = require('./modules/router.js'),
  socketio = require('socket.io'),
  path = require('path'),
  message = require('./modules/messages.js'),
  users = require('./modules/users.js'),
  questions = require('./modules/questions.js'),
  compression = require('compression');

const port = process.env.PORT || 3000,
  app = express(),
  botName = 'Weerman';

const userAnswers = [];
let questionCount = [
  { game: 'Room 1', question: 0 },
  { game: 'Room 2', question: 0 },
  { game: 'Room 3', question: 0 },
];

// TODO: prevent submits from old questions

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({ extended: true }))
  .use(compression())
  .set('views', __dirname + '/views/')
  .set('view engine', 'ejs')
  .get('/', router.home)
  .get('/chat', router.chat);

const server = app.listen(port, () =>
  console.log(`App listening on port ${port}`)
);
const io = socketio.listen(server);

// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = users.userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit(
      'message',
      message.formatMessage(botName, `Welkom ${user.username}!`)
    );
    const _amountOfUsers = users.getRoomUsers(user.room).length;

    if (_amountOfUsers === 0) {
      q = 0;
    }

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        message.formatMessage(
          botName,
          `${user.username} is de room binnengekomen.`
        )
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: users.getRoomUsers(user.room),
    });
  });

  // Listen for chat message
  socket.on('chatMessage', (msg) => {
    const user = users.getCurrentUser(socket.id);
    io.to(user.room).emit('message', message.formatMessage(user.username, msg));
  });

  // Listen for new question
  socket.on('newQuestion', () => {
    const user = users.getCurrentUser(socket.id);
    const questionIndex = questionCount.findIndex(
      (item) => item.game === user.room
    );
    console.log(`question index = ${questionIndex}`);
    console.log(`questionCount = ${questionCount}`);
    let q = questionCount[questionIndex].question;
    if (q >= 4) {
      questionCount[questionIndex].question = 0;
      q = 0;
    }

    const cityone = questions.questions[`question${q + 1}`].cityone,
      citytwo = questions.questions[`question${q + 1}`].citytwo;

    io.to(user.room).emit(
      'message',
      message.formatMessage(botName, 'Hier is een nieuwe vraag...')
    );
    io.to(user.room).emit(
      'message',
      message.formatMessage(
        botName,
        'In welke stad is het momenteel warmer, denk je?'
      )
    );

    io.to(user.room).emit(
      'question',
      message.formatQuestion(botName, cityone, citytwo, q)
    );
    questionCount[questionIndex].question++;
  });

  // Listen for answer
  socket.on('answerGiven', async (answer) => {
    const user = users.getCurrentUser(socket.id);
    const questionIndex = questionCount.findIndex(
      (item) => item.game === user.room
    );
    const q = questionCount[questionIndex].question;
    const cityone = questions.questions[`question${q}`].cityone.city,
      citytwo = questions.questions[`question${q}`].citytwo.city;

    // * Use in production mode and if you need to access the API
    const tempCityOne = await questions.getWeather(cityone),
      tempCityTwo = await questions.getWeather(citytwo);
    // console.log({ tempCityOne, tempCityTwo });
    // outcome:
    // {
    //   tempCityOne: { temp: 24.12, name: 'Amsterdam' },
    //   tempCityTwo: { temp: 23.55, name: 'London' }
    // }

    // * Use when in development mode and you don't need to use the API
    // const tempCityOne = { temp: 24.12, name: 'Amsterdam' },
    //   tempCityTwo = { temp: 23.55, name: 'London' };
    const rightAnswer = getRightAnswer(tempCityOne, tempCityTwo);
    const index = userAnswers.findIndex((item) => item[user.room]);
    index === -1
      ? userAnswers.push({ [user.room]: [socket.id] })
      : userAnswers[index][user.room].push(socket.id);

    console.log({ tempCityOne, tempCityTwo });

    socket.emit(
      'message',
      message.formatMessage(
        botName,
        `Het is nu ${tempCityOne.temp} graden in ${cityone} en ${tempCityTwo.temp} graden in ${citytwo}.`
      )
    );

    if (answer === 'cityone') {
      socket.emit(
        'message',
        message.formatMessage(botName, `Je koos voor ${cityone}`)
      );
    } else if (answer === 'citytwo') {
      socket.emit(
        'message',
        message.formatMessage(botName, `Je koos voor ${citytwo}`)
      );
    }
    if (rightAnswer === 'cityone') {
      socket.emit(
        'message',
        message.formatMessage(botName, `Het juiste antwoord was ${cityone}`)
      );
    } else if (rightAnswer === 'citytwo') {
      socket.emit(
        'message',
        message.formatMessage(botName, `Het juiste antwoord was ${citytwo}`)
      );
    }

    // Add new score
    const userIndex = users.users.findIndex((_user) => _user.id === user.id);
    answer === rightAnswer || rightAnswer === 'draw'
      ? (users.users[userIndex].score = users.users[userIndex].score + 1)
      : (users.users[userIndex].score = users.users[userIndex].score);

    // Check if everyone has given an answer
    const amountOfUsers = users.getRoomUsers(user.room).length;
    const roomIndex = userAnswers.findIndex((item) => item[user.room]);
    const amountOfAnswers = userAnswers[roomIndex][user.room].length;
    if (amountOfUsers === amountOfAnswers) {
      io.to(user.room).emit(
        'message',
        message.formatMessage(botName, 'Iedereen heeft geantwoord!')
      );
      io.to(user.room).emit('dedisable');
      // Send users and room info
      let newLeaderboard = users.getRoomUsers(user.room);

      if (newLeaderboard.length > 1) {
        function compare(a, b) {
          if (a.score > b.score) {
            return -1;
          }
          if (a.score < b.score) {
            return 1;
          }
          return 0;
        }

        newLeaderboard.sort(compare);
      }

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: newLeaderboard,
      });
      // Reset answers array for room
      userAnswers[roomIndex][user.room] = [];
      console.log(userAnswers);
    }
  });
  function getRightAnswer(cityOne, cityTwo) {
    const tempOne = cityOne.temp,
      tempTwo = cityTwo.temp;
    const cal = tempOne - tempTwo;
    if (cal > 0) {
      console.log('temp one is higher');
      return 'cityone';
    } else if (cal < 0) {
      console.log('temp two is higher');
      return 'citytwo';
    } else if (cal === 0) {
      console.log('temp one and two are the same');
      return `draw`;
    }
  }

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = users.userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        message.formatMessage(botName, `${user.username} has left...`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: users.getRoomUsers(user.room),
      });
    }
  });
});
