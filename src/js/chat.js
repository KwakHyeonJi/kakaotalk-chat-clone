"use strict";
const socket = io();

const nickname = document.querySelector("#nickname");
const chatList = document.querySelector(".chatting-list");
const chatInput = document.querySelector(".chatting-input");
const sendButton = document.querySelector(".send-button");
const displayContainer = document.querySelector(".display-container");
const inputContainer = document.querySelector(".input_container");

if (!chatInput.value) {
  sendButton.style.pointerEvents = "none";
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

chatInput.addEventListener("input", (event) => {
  const obj = event.target;
  resize(obj);
  if (!obj.value || obj.value === "\n") {
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

window.addEventListener("resize", () => resize(chatInput), true);

window.onblur = () => {
  sendButton.classList.add("disabled");
};

window.onfocus = () => {
  sendButton.classList.remove("disabled");
};
