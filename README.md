# Real Time Web Herkansing

<img src="https://img.shields.io/badge/PWA-Yes-brightgreen" />
<img src="https://img.shields.io/github/license/martendebruijn/real-time-web-her" />
<img src="/node/v/:packageName" />
	

## Introduction
A simple game application. Room based chat application maded with Socket IO. Users get asked which of two cities it is warmer in real time.

![Screenshot applicatie](/readme_img/screenshot-dark.png)

## Table of contents
  - [Usage](#usage)
  - [Live Demo](#live-demo)
  - [Data Life Cycle](#data-life-cycle)
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
git clone https://github.com/martendebruijn/real-time-web-her.git
cd real-time-web-her
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

Open a browser and go to localHost

```zsh
localhost:3000
```

## Live Demo
[Live demo link](https://real-time-web-marten.herokuapp.com/)

## Data Life Cycle

![Data Life Cycle Diagram](/readme_img/dlc-rtw-her.png)

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

Join chatroom

```js
// Join chatroom
socket.emit('joinRoom', { username, room });
```

Send chat message to server

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

Send request for new question to server

```js
// Listen for new question
newQuestionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('newQuestion');
});
```

Send the answer given by the user to the server

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

Listen for the users who are in the room

```js
// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
```

Listen for messages

```js
// Message from server
socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
```

Listen for questions

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

Dedisable the new question button

```js
// Dedisable new question form
socket.on('dedisable', () => {
  newQuestionFormSubmit.removeAttribute('disabled');
});
```

### Server side

**Emitters**

Send welcome message to user

```js
   // Welcome current user
    socket.emit(
      'message',
      message.formatMessage(botName, `Welkom ${user.username}!`)
    );
```

Send message to all other users that someone has joined

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

Send users in a room

```js
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: users.getRoomUsers(user.room),
    });
```

Send message that there is a new question

```js
  io.to(user.room).emit(
      'message',
      message.formatMessage(botName, 'Hier is een nieuwe vraag...')
    );
```

Send message asking which city is warmer

```js

    io.to(user.room).emit(
      'message',
      message.formatMessage(
        botName,
        'In welke stad is het momenteel warmer, denk je?'
      )
    );
```

Send question to users

```js
   io.to(user.room).emit(
      'question',
      message.formatQuestion(botName, cityone, citytwo, q)
    );
```

Send the current temperatures

```js
    socket.emit(
      'message',
      message.formatMessage(
        botName,
        `Het is nu ${tempCityOne.temp} graden in ${cityone} en ${tempCityTwo.temp} graden in ${citytwo}.`
      )
    );
```

Send message telling the user which city they have chosen

```js
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
```

Send the correct answer to users

```js
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
```

Send message that every user has answered

```js
io.to(user.room).emit(
        'message',
        message.formatMessage(botName, 'Iedereen heeft geantwoord!')
      );
```

Trigger dedisable function on the client side

```js
io.to(user.room).emit('dedisable');
```

Send users and room information

```js
  // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: users.getRoomUsers(user.room),
      });
```

Send message that a user has left to all users

```js
 io.to(user.room).emit(
        'message',
        message.formatMessage(botName, `${user.username} has left...`)
      );
```

**Listeners**

Function that does everything when a user connects to the server

```js
io.on('connection', (socket) => {} )
```

Functions that lets a user to join a room

```js
socket.on('joinRoom', ({ username, room }) => {} )
```

Listens for chatmessages 

```js
  // Listen for chat message
  socket.on('chatMessage', (msg) => {})
```

Listens for a request for a new question

  ```js
  // Listen for new question
  socket.on('newQuestion', () => {})
  ```

Listen for answers given

  ```js
  // Listen for answer
  socket.on('anwerGiven', async (answer) => {})
  ```

Listens for a user disconnects

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

## Whishlist
- [ ] Beter focus on questions
- [ ] Make cities and countries dynamic and random
- [ ] Prevent users with the same username to enter a room

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
