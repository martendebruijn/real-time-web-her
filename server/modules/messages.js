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
  // TODO: add formating when there are zeros -> 11:10 instead of 11:1
  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes();
  return time;
}
