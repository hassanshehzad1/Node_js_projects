// Client side rendering
const socket = io("http://localhost:3000");
const sendBtn = document.getElementById("btn");
const inputMsg = document.getElementById("input_send");
const day = document.getElementById("day");
const nameId = document.getElementById("name");
const mediaChatServer = document.getElementsByClassName("media-chat-server");
const mediaChatClient = document.getElementsByClassName("media-chat-reverse");
const psContainer = document.getElementById("chat-content");

const audio = new Audio("../tone.mp3");
// Adding the new user
const newUserJoin = (name, message, type) => {
  let time = "";
  // Getting current data
  let date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  mins = mins < 10 ? "0" + mins : mins;
  time = hours + ":" + mins;

  // creating p meta
  let data = `<div class="media media-chat media-chat-server">
  <h2 id="name" class="name">${name}</h2>
  <div class="media-body">
    <p>
      ${message}
    </p>
    <p class="meta"><time id="time" class="time">${time}</time></p>
  </div>
</div>`;
  let div = document.createElement("div");
  div.innerHTML = data;
  psContainer.append(div);
};

// Receiveing a new message
const sendReceiveMessage = (name, message, type) => {
  let time = "";
  // Getting current data
  let date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  mins = mins < 10 ? "0" + mins : mins;
  time = hours + ":" + mins;

  // creating p meta
  let data = `<div class="media media-chat media-chat-${type}">
  <h2 id="name" class="name">${name}</h2>
  <div class="media-body">
    <p>
      ${message}
    </p>
    <p class="meta"><time id="time" class="time">${time}</time></p>
  </div>
</div>`;
  let div = document.createElement("div");
  div.innerHTML = data;
  psContainer.append(div);
  if (type === "server") {
    audio.play();
  }
};

// Left message
const userLeft = (name, message, type) => {
  let time = "";
  // Getting current data
  let date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  mins = mins < 10 ? "0" + mins : mins;
  time = hours + ":" + mins;

  // creating p meta
  let data = `<div class="media media-chat media-chat-${type}">
  <h2 id="name" class="name">${name}</h2>
  <div class="media-body">
    <p>
      ${message}
    </p>
    <p class="meta"><time id="time" class="time">${time}</time></p>
  </div>
</div>`;
  let div = document.createElement("div");
  div.innerHTML = data;
  psContainer.append(div);
  if (type === "server") {
    audio.play();
  }
};

// Prompt the user name
let userName = "";
do {
  userName = prompt("Name? ");
} while (name == null || userName == "" || userName == undefined);
socket.emit("newUserAdd", userName);

// User join
socket.on("userAdd", (name) => {
  newUserJoin(name, `${name} user joined`, "server");
});

// Sending message
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const message = inputMsg.value;
  const type = "reverse";
  const name = "you";
  sendReceiveMessage(name, message, type);
  socket.emit("send", message);
  inputMsg.value = "";
});
//Receiving a message
socket.on("receive", (data) => {
  sendReceiveMessage(data.userName, data.message, "server");
});

// Left chat
socket.on("left", (name) => {
  let message = "left chat";
  console.log("message", message);
  userLeft(name.userName, message, "server");
});
