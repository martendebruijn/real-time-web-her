module.exports = {
  formatMessage,
};

function formatMessage(username, text) {
  return {
    username,
    text,
    time: getCurrentTime(),
  };
}

function getCurrentTime() {
  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes();
  return time;
}
