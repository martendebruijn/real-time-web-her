module.exports = { home, chat };

function home(req, res) {
  res.render('home', {});
}
function chat(req, res) {
  const query = req.query;

  res.render('chat', {});
}
