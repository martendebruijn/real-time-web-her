const chatForm = document.getElementById('chat-form'),
  chatMessages = document.querySelector('.chat-messages'),
  roomName = document.getElementById('room-name'),
  userslist = document.getElementById('users'),
  newQuestionForm = document.getElementById('newQuestionForm'),
  answerForm = document.getElementById('answer-form');

const socket = io();

// TODO: don't send empty messages
// TODO: don't send 'welcome user' everytime a user gives an answer

const parameters = window.location.search;
const urlParams = new URLSearchParams(parameters);
const username = urlParams.get('username'),
  room = urlParams.get('room');

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg;

  // Emit message to server
  socket.emit('chatMessage', msg.value);

  // Clear input
  msg.value = '';
  msg.focus();
});

// Listen for new question
newQuestionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('newQuestion');
});

// Listen for answer
answerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityone = e.target.elements[2].checked,
    citytwo = e.target.elements[3].checked;

  if (cityone) {
    socket.emit('answerGiven', 'cityone');
  } else if (citytwo) {
    socket.emit('answerGiven', 'citytwo');
  }
});

// Output message to DOM
function outputMessage(message) {
  const username = message.username,
    text = message.text,
    time = message.time,
    div = document.createElement('div');
  div.classList.add('message');
  div.classList.add('message-user');
  div.innerHTML = `
  <div>
  <span class="username">${username}</span>
  <span class="time">${time}</span>
  </div>
  <p>${text}</p>
`;
  chatMessages.appendChild(div);
}

// Output question to DOM
function outputQuestion(message) {
  const username = message.username,
    city = message.text,
    time = message.time,
    div = document.createElement('div');
}

// Output room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
// Output users to DOM
function outputUsers(users) {
  userslist.innerHTML = `
    ${users
      .map(
        (user) =>
          `<li> <p>1.</p> <h3>${user.username}</h3> <p>${user.score}</p> </li>`
      )
      .join('')}`;
}
