# Real Time Web Herkansing

## Introduction

<!-- screenshot applicatie -->

## Table of contents
  - [Usage](#usage)
  - [Live Demo](#live-demo)
  - [Dependencies](#dependencies)
  - [NPM Scripts](#npm-scripts)
  - [Gulp tasks](#gulp-tasks)
  - [Socket events](#socket-events)
  - [API](#api)
  - [Credits](#credits)
  - [Whishlist](#whishlist)
  - [Sources](#sources)


## Usage 
### 1. Clone repo & install dependencies

```zsh
git clone ....
cd ....
npm install
```

### 2. Create .env file 
Create `.env` file in the **root folder**
Request a key [here](https://openweathermap.org/).

```zsh
KEY=<YOUR_KEY>

```

### 3. Run app

**Development**

```zsh
npm run dev
```

**Production**

```zsh
npm start
```

## Live Demo

## Dependencies

| Dependency        | NPM Package Link                                                     |
| ----------------- | -------------------------------------------------------------------- |
| Compression       | [Compression](https://www.npmjs.com/package/compression)             |
| Dotenv            | [Dotenv](https://www.npmjs.com/package/dotenv)                       |
| Ejs               | [Ejs](https://www.npmjs.com/package/ejs)                             |
| Express           | [Express](https://www.npmjs.com/package/express)                     |
| Gulp              | [Gulp](https://www.npmjs.com/package/gulp)                           |
| Gulp autoprefixer | [Gulp autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) |
| Gulp clean css    | [Gulp clean css](https://www.npmjs.com/package/gulp-clean-css)       |
| Gulp concat       | [Gulp concat](https://www.npmjs.com/package/gulp-concat)             |
| Gulp terser       | [Gulp terser](https://www.npmjs.com/package/gulp-terser-js)          |
| Node fetch        | [Node fetch](https://www.npmjs.com/package/node-fetch)               |
| Path              | [Path](https://www.npmjs.com/package/path)                           |
| Socket.io         | [Socket.io](https://www.npmjs.com/package/socket.io)                 |
| Nodemon           | [Nodemon](https://www.npmjs.com/package/nodemon)                     |

## NPM Scripts

| NPM Script         | Task                                    | What it does                        |
| ------------------ | --------------------------------------- | ----------------------------------- |
| `npm run prestart` | `gulp`                                  | Build CSS and ES files before start |
| `npm start`        | `node server/server.js`                 | Start app                           |
| `npm run dev`      | `gulp watch & nodemon server/server.js` | Run app in development mode         |
| `npm run deploy`   | `git push heroku master`                | Deploy to Heroku                    |
| `npm run logs`     | `heroku logs --tail`                    | Heroku logs                         |

## Gulp tasks

| Gulp task                  | Task                   |
| -------------------------- | ---------------------- |
| `gulp css`                 | Build CSS files        |
| `gulp es`                  | Build ES files         |
| `gulp watch`               | Watch CSS and ES files |
| `gulp build` **or** `gulp` | Build CSS and ES files |

## Socket events

### Client side

**Emitters**

```js
// Join chatroom
socket.emit('joinRoom', { username, room });
```

```js
// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg;

  // Emit message to server
  if (msg.value.length !== 0) {
    socket.emit('chatMessage', msg.value);
  }

  // Clear input
  msg.value = '';
  msg.focus();
});
```

```js
// Listen for new question
newQuestionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('newQuestion');
});
```

```js
// Listen for answer
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityone = e.target.elements[2].checked,
      citytwo = e.target.elements[3].checked;

    if (cityone) {
      socket.emit('answerGiven', 'cityone');
    } else if (citytwo) {
      socket.emit('answerGiven', 'citytwo');
    }
  });
```

**Listeners**

```js
// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
```
```js
// Message from server
socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
```

```js
// Question from server
socket.on('question', (question) => {
  console.log(question);
  outputQuestion(question);

  // Prevent submitting new question form
  newQuestionFormSubmit.setAttribute('disabled', true);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
```

```js
// Dedisable new question form
socket.on('dedisable', () => {
  newQuestionFormSubmit.removeAttribute('disabled');
});
```

### Server side

**Emitters**

```js
   // Welcome current user
    socket.emit(
      'message',
      message.formatMessage(botName, `Welkom ${user.username}!`)
    );
```

```js
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
 ```
```js

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: users.getRoomUsers(user.room),
    });
```

```js
  io.to(user.room).emit(
      'message',
      message.formatMessage(botName, 'Hier is een nieuwe vraag...')
    );
```

```js

    io.to(user.room).emit(
      'message',
      message.formatMessage(
        botName,
        'In welke stad is het momenteel warmer, denk je?'
      )
    );
```

```js
   io.to(user.room).emit(
      'question',
      message.formatQuestion(botName, cityone, citytwo, q)
    );
```
```js
    socket.emit(
      'message',
      message.formatMessage(botName, `Je koos voor ${answer}`)
    );
```
```js
socket.emit(
      'message',
      message.formatMessage(botName, `Het juiste antwoord was ${rightAnswer}`)
    );
```

```js
io.to(user.room).emit(
        'message',
        message.formatMessage(botName, 'Iedereen heeft geantwoord!')
      );
```

```js
io.to(user.room).emit('dedisable');
```

```js
  // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: users.getRoomUsers(user.room),
      });
```
```js
 io.to(user.room).emit(
        'message',
        message.formatMessage(botName, `${user.username} has left...`)
      );
```

**Listeners**

```js
io.on('connection', (socket) => {} )
```

```js
socket.on('joinRoom', ({ username, room }) => {} )

```js
  // Listen for chat message
  socket.on('chatMessage', (msg) => {})
  ```

  ```js
  // Listen for new question
  socket.on('newQuestion', () => {})
  ```
  ```js
  // Listen for answer
  socket.on('anwerGiven', async (answer) => {})
  ```

  ```js
  socket.on('disconnect', () => {})
  ```

## API
Deze applicatie maakt gebruik van [de Free API van Open Weather](https://openweathermap.org/price). Om gebruik van deze API te maken heeft men een key nodig - deze kan men aanvragen op de vorige link.

Van de Free API kan men het huidige weer opvragen, een 3-uur weersverwachting en basic weather maps.

De Free API heeft een restrictie van **1,000 calls per dag** en **60 calls per minuut**.

De documentatie kan men [hier](https://openweathermap.org/api) vinden.

## Credits
- [Meyerweb: CSS Reset](http://meyerweb.com/eric/tools/css/reset/)

<!-- ## Whishlist -->

## Sources

| Icon | Category                |
| ---- | ----------------------- |
| 📹    | Video                   |
| 📖    | Documentation / Article |
| ⚙️    | Code                    |
| 🛠    | Tool                    |

| Cat. | Title                                                        | Author           | Origin                                                                                                         |
| ---- | ------------------------------------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| 📹    | Realtime Chat With Users & Rooms - Socket.io, Node & Express | Traversy Media   | [YouTube](https://www.youtube.com/watch?v=jD7FnbI76Hg)                                                         |
| 📖    | Socket IO - Getting Started                                  | -                | [Socket.io](https://socket.io/get-started/chat/)                                                               |
| 📖    | Build a Simple Chat App With NodeJS and SocketIO             | Noufel Gouirhate | [Medium](https://medium.com/@noufel.gouirhate/build-a-simple-chat-app-with-node-js-and-socket-io-ea716c093088) |
