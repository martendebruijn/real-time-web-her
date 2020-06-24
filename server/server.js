require('dotenv').config();
const express = require('express'),
  router = require('./modules/router.js'),
  socketio = require('socket.io'),
  path = require('path'),
  message = require('./modules/messages.js'),
  users = require('./modules/users.js'),
  questions = require('./modules/questions.js');

const port = process.env.PORT || 3000,
  app = express(),
  botName = 'Weerman';

const userAnswers = [];
let questionCount = [
  { game: 'game1', question: 0 },
  { game: 'game2', question: 0 },
  { game: 'game3', question: 0 },
];

// TODO: Prevent multiple submits and submits from old questions

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({ extended: true }))
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
    console.log(room);
    console.log(user.room);

    // Welcome current user
    socket.emit(
      'message',
      message.formatMessage(botName, `Welcome ${user.username}!`)
    );

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        message.formatMessage(botName, `${user.username} has joined the chat.`)
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
    const user = users.getCurrentUser(socket.id),
      cityone = questions.questions.questionone.cityone.city,
      citytwo = questions.questions.questionone.citytwo.city;
    io.to(user.room).emit(
      'message',
      message.formatMessage(botName, 'new question...')
    );

    const questionIndex = questionCount.findIndex(
      (item) => item.game === user.room
    );
    const q = questionCount[questionIndex].question;
    io.to(user.room).emit(
      'question',
      message.formatQuestion(botName, cityone, citytwo, q)
    );
    questionCount[questionIndex].question++;
  });

  // Listen for answer
  socket.on('answerGiven', async (answer) => {
    const user = users.getCurrentUser(socket.id),
      cityone = questions.questions.questionone.cityone.city,
      citytwo = questions.questions.questionone.citytwo.city;
    // const tempCityOne = await questions.getWeather(cityone),
    //   tempCityTwo = await questions.getWeather(citytwo);
    // console.log({ tempCityOne, tempCityTwo });
    // outcome:
    // {
    //   tempCityOne: { temp: 24.12, name: 'Amsterdam' },
    //   tempCityTwo: { temp: 23.55, name: 'London' }
    // }
    const tempCityOne = { temp: 24.12, name: 'Amsterdam' },
      tempCityTwo = { temp: 23.55, name: 'London' };
    const rightAnswer = getRightAnswer(tempCityOne, tempCityTwo);
    const index = userAnswers.findIndex((item) => item[user.room]);
    index === -1
      ? userAnswers.push({ [user.room]: [socket.id] })
      : userAnswers[index][user.room].push(socket.id);

    socket.emit(
      'message',
      message.formatMessage(botName, `Je koos voor ${answer}`)
    );
    socket.emit(
      'message',
      message.formatMessage(botName, `Het juiste antwoord was ${rightAnswer}`)
    );
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
        message.formatMessage(botName, 'everyone has answered')
      );
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: users.getRoomUsers(user.room),
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

  // Listen for answer
  // socket.on('answerMessage', (answer) => {
  //   const user = users.getCurrentUser(socket.id);
  //   if (answer.cityone) {
  //     console.log('user choose city 1');
  //     // TODO: add the names of the cities
  //     const msg = `${user.username} heeft gekozen voor city one`;
  //     io.to(user.room).emit(
  //       'message',
  //       message.formatMessage(user.username, msg)
  //     );
  //   } else if (answer.citytwo) {
  //     console.log('user choose city 2');
  //     const msg = `${user.username} heeft gekozen voor city two`;
  //     io.to(user.room).emit(
  //       'message',
  //       message.formatMessage(user.username, msg)
  //     );
  //   } else {
  //     console.log('no answer given');
  //     const msg = `${user.username} heeft gekozen voor niks`;
  //     io.to(user.room).emit(
  //       'message',
  //       message.formatMessage(user.username, msg)
  //     );
  //   }
  // });
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
// Listen for answer
// answerForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const cityone = e.target.elements[2].checked,
//     citytwo = e.target.elements[3].checked;

//   if (cityone) {
//     socket.emit('answerGiven', 'cityone');
//   } else if (citytwo) {
//     socket.emit('answerGiven', 'citytwo');
//   }
// });
// answerForm = document.getElementById('answer-form');
