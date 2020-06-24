const chatForm = document.getElementById('chat-form'),
  chatMessages = document.querySelector('.chat-messages'),
  roomName = document.getElementById('room-name'),
  userslist = document.getElementById('users'),
  newQuestionForm = document.getElementById('newQuestionForm'),
  newQuestionFormSubmit = document.getElementById('newQuestionForm_submit');

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

// Question from server
socket.on('question', (question) => {
  console.log(question);
  outputQuestion(question);

  // Prevent submitting new question form
  newQuestionFormSubmit.setAttribute('disabled', true);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Dedisable new question form
socket.on('dedisable', () => {
  newQuestionFormSubmit.removeAttribute('disabled');
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg;

  // Emit message to server
  if (msg.value.length !== 0) {
    socket.emit('chatMessage', msg.value);
  }

  // Clear input
  msg.value = '';
  msg.focus();
});

// Listen for new question
newQuestionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('newQuestion');
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
function outputQuestion(question) {
  const username = question.username,
    cityOne = question.cityOne,
    cityTwo = question.cityTwo,
    time = question.time,
    n = question.n,
    div = document.createElement('div');
  div.innerHTML = `
    <form action="" method="GET" id="questionForm${n}" class="questionForms">  
        <input type="text" hidden value="<%= username  %> " name="username">
        <input type="text" hidden value="<%= room  %> " name="room">
        <input type="radio" name="answer" id="cityone${n}">
        <label for="cityone${n}">
            <div>
                <span class="username">${username}</span>
                <span class="time">${time}</span>
            </div>
            <img src="${cityOne.img}" alt="Flag of ${cityOne.city}">
            <h2 class="country">${cityOne.country}</h2>
            <h3 class="city">${cityOne.city}</h3>
        </label>
        <input type="radio" name="answer" id="citytwo${n}">
        <label for="citytwo${n}">
            <div>
                <span class="username">${username}</span>
                <span class="time">${time}</span>
            </div>
            <img src="${cityTwo.img}" alt="Flag of ${cityTwo.city}">
            <h2 class="country">${cityTwo.country}</h2>
            <h3 class="city">${cityTwo.city}</h3>
        </label>
        <button type="submit" class="question_submit">
            <div>
                <span class="username">${username}</span>
                <span class="time">${time}</span>
            </div>
            <p>Bevestig antwoord</p>
        </button>
        </form>
    `;
  chatMessages.appendChild(div);
  const form = document.getElementById(`questionForm${n}`);
  // Listen for answer
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityone = e.target.elements[2].checked,
      citytwo = e.target.elements[3].checked;

    if (cityone) {
      socket.emit('answerGiven', 'cityone');
    } else if (citytwo) {
      socket.emit('answerGiven', 'citytwo');
    }
  });
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
