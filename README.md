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
Request a key here 

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

| Dependencie       | NPM Package Link                                                     |
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

| Event         | What it does |
| ------------- | ------------ |
| `joinRoom`    | It does this |
| `roomUsers`   | It does this |
| `message`     | It does this |
| `question`    | It does this |
| `dedisable`   | It does this |
| `chatMessage` | It does this |
| `newQuestion` | It does this |
| `answerGiven` | It does this |

## API

## Credits
- [Meyerweb: CSS Reset](http://meyerweb.com/eric/tools/css/reset/)

## Whishlist

## Sources

| Icon | Category                |
| ---- | ----------------------- |
| 📹    | Video                   |
| 📖    | Documentation / Article |
| ⚙️    | Code                    |
| 🛠    | Tool                    |

| Cat. | Title                                                        | Author         | Origin                                                 |
| ---- | ------------------------------------------------------------ | -------------- | ------------------------------------------------------ |
| 📹    | Realtime Chat With Users & Rooms - Socket.io, Node & Express | Traversy Media | [YouTube](https://www.youtube.com/watch?v=jD7FnbI76Hg) |
| 📖    | Socket IO - Getting Started                                  | -              | [Socket.io](https://socket.io/get-started/chat/)       |

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
❤️ Thanks for reading ❤️<br/>
❤️ [Marten de Bruijn](http://martendebruijn.nl/) ❤️
