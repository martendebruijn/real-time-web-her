require('dotenv').config();
const fetch = require('node-fetch'),
  key = process.env.KEY;

module.exports = { home, chat };

function home(req, res) {
  res.render('home', {});
}
function chat(req, res) {
  const query = req.query;
  const username = query.username,
    room = query.room;
  res.render('chat', {
    username,
    room,
  });
}
