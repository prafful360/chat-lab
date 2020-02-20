// const name = document.querySelector("#name");
// const msg = document.querySelector("#message")
// const send = document.querySelector("#send")
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const messageInput = document.getElementById("messageInput");
const socket = io("http://localhost:3000");

function drawUser(user) {
  context.beginPath();
  context.fillStyle = "black";
  context.arc(user.x, user.y, 20, 0, Math.PI * 2);
  context.fill();
  context.textAlign = "center";
  context.fillText(user.name, user.x, user.y + 30);
  context.fillText(user.message, user.x, user.y - 30);
  context.closePath();
}

function moveUser(user, x, y){
  var distance = Math.sqrt(Math.pow(user.x - x, 2) + Math.pow(user.y - y, 2))
  var velocity = 200;
  var time = distance / velocity;
  gsap.killTweensOf(user);
  gsap.to(user, {
    duration: 1,
    ease: 'linear',
    x: x,
    y: y
  })
}

var users = {};
socket.on("connect", () => {
  const name = "Guest " + Math.floor(Math.random() * 10);
  socket.emit("login", name);
});

socket.on("user-connected", user => {
  users[user.clientId] = user;
});

socket.on("users-list", usersList => {
  users = usersList;
});

socket.on('user-updated', user => {
  users[user.clientId].message = user.message;
  moveUser(users[user.clientId], user.x, user.y);
})

socket.on("user-disconnected", clientId => {
  delete users[clientId];
});
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i in users) {
    drawUser(users[i]);
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);


//Message Input Event
messageInput.addEventListener('keyup', e => {
    if (e.keyCode == 13) //enter
        socket.emit('message', messageInput.value);
})

canvas.addEventListener('click', e => {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  socket.emit('move', x, y);
})