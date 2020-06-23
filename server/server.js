require('dotenv').config();
const express = require('express'),
  router = require('./modules/router.js'),
  socketio = require('socket.io'),
  path = require('path'),
  message = require('./modules/messages.js'),
  users = require('./modules/users.js');

const port = process.env.PORT || 3000,
  app = express(),
  botName = 'Admin';

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
  // Listen for answer
  socket.on('answerMessage', (answer) => {
    const user = users.getCurrentUser(socket.id);
    if (answer.cityone) {
      console.log('user choose city 1');
      // TODO: add the names of the cities
      const msg = `${user.username} heeft gekozen voor city one`;
      io.to(user.room).emit(
        'message',
        message.formatMessage(user.username, msg)
      );
    } else if (answer.citytwo) {
      console.log('user choose city 2');
      const msg = `${user.username} heeft gekozen voor city two`;
      io.to(user.room).emit(
        'message',
        message.formatMessage(user.username, msg)
      );
    } else {
      console.log('no answer given');
      const msg = `${user.username} heeft gekozen voor niks`;
      io.to(user.room).emit(
        'message',
        message.formatMessage(user.username, msg)
      );
    }
  });
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
