// const name = document.querySelector("#name");
// const msg = document.querySelector("#message")
// const send = document.querySelector("#send")
const canvas = document.getElementById('game');
const context = canvas.getContext("2d");
const messageInput = document.getElementById('messageInput')
const socket = io("http://localhost:3000");

socket.on('connect', ()=>{
    const name = 'Guest' + Math.floor(Math.random() * 99);
    socket.emit('login', name);
});

socket.on('user-connected', user => {
    users[user.clientId] = user;
});

socket.on('users-list', usersList => {
    users = usersList;
})