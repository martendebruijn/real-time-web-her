const chatForm = document.getElementById('chat-form'),
  chatMessages = document.querySelector('.chat-messages'),
  roomName = document.getElementById('room-name'),
  userslist = document.getElementById('users');

const socket = io();

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

// Output message to DOM
function outputMessage(message) {
  const username = message.username,
    text = message.text,
    time = message.time,
    div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = ` <p class="meta">${username} <span>${time}</span></p>
  <p class="text">
    ${text}
  </p>`;
  chatMessages.appendChild(div);
}

// Output room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
// Output users to DOM
function outputUsers(users) {
  userslist.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
}
