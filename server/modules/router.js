module.exports = { home, chat, design, front };

function home(req, res) {
  res.render('home', {});
}
function chat(req, res) {
  res.render('chat', {});
}
function design(req, res) {
  res.render('design', {});
}
function front(req, res) {
  res.render('front', {});
}
