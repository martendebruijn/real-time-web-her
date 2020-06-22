require('dotenv').config();
const express = require('express'),
  router = require('./modules/router.js'),
  socketio = require('socket.io'),
  port = process.env.PORT || 3000,
  path = require('path'),
  app = express(),
  message = require('./modules/messages.js'),
  botName = 'Admin',
  users = require('./modules/users.js');

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
      room: users.room,
      users: users.getRoomUsers(user.room),
    });
  });

  // Listen for chat message
  socket.on('chatMessage', (msg) => {
    const user = users.getCurrentUser(socket.id);
    io.to(user.room).emit('message', message.formatMessage(user.username, msg));
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
        room: users.room,
        users: users.getRoomUsers(user.room),
      });
    }
  });
});
