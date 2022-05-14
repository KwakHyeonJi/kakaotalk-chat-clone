"use strict";
const socket = io();

const nickname = document.querySelector("#nickname");
const confirmButton = document.querySelector(".confirm-button");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayContainer = document.querySelector(".display-container");

let user;

function LiModel(name, msg, time) {
  this.name = name;
  this.msg = msg;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add(nickname.value === this.name ? "sent" : "received");
    const dom = `<span class="profile">
              <span class="user">${this.name}</span>
              <img
                class="image"
                src="http://placeimg.com/50/50/any"
                alt="any"
              />
            </span>
            <span class="message">${this.msg}</span>
            <span class="time">${this.time}</span>`;
    li.innerHTML = dom;
    chatList.appendChild(li);
  };
}

function setUser() {
  user = nickname.value;
  confirmButton.style.display = "none";
  nickname.readOnly = true;
}

function resize(obj) {
  obj.style.height = "auto";
  obj.style.height = `${obj.scrollHeight}px`;
}

function send() {
  const param = {
    name: nickname.value,
    msg: chatInput.value,
  };
  socket.emit("chatting", param);
}

nickname.addEventListener("input", (event) => {
  if (event.target.value) {
    confirmButton.classList.remove("disabled");
  } else {
    confirmButton.classList.add("disabled");
  }
});
nickname.addEventListener("keypress", (event) => {
  if (event.target.value && event.keyCode === 13) {
    setUser();
  }
});

confirmButton.addEventListener("click", setUser);

chatInput.addEventListener("input", (event) => {
  const obj = event.target;
  resize(obj);
  if (!user || !obj.value || obj.value === "\n") {
    obj.value = null;
    sendButton.style.pointerEvents = "none";
  } else {
    sendButton.style.pointerEvents = "auto";
  }
});
chatInput.addEventListener("keypress", (event) => {
  if (event.target.value && event.keyCode === 13) {
    send();
    event.target.value = null;
  }
});

sendButton.addEventListener("click", (event) => {
  send();
  chatInput.value = null;
  resize(chatInput);
  event.target.style.pointerEvents = "none";
});

socket.on("chatting", (data) => {
  const { name, msg, time } = data;
  const item = new LiModel(name, msg, time);
  item.makeLi();
  displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

window.addEventListener("resize", () => resize(chatInput), true);

window.onblur = () => {
  sendButton.classList.add("disabled");
};
window.onfocus = () => {
  sendButton.classList.remove("disabled");
};
