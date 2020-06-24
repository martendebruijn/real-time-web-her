module.exports = {
  formatMessage,
  formatQuestion,
};

function formatMessage(username, text) {
  return {
    username,
    text,
    time: getCurrentTime(),
  };
}
function formatQuestion(username, cityOne, cityTwo, n) {
  return {
    username,
    cityOne,
    cityTwo,
    time: getCurrentTime(),
    n: n,
  };
}

function getCurrentTime() {
  const today = new Date();
  const time =
    today.getHours() +
    ':' +
    (today.getMinutes() < 10 ? '0' : '') +
    today.getMinutes();
  return time;
}
