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
  // TODO: add formating when there are zeros -> 11:10 instead of 11:1
  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes();
  return time;
}
