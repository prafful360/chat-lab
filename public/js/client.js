// const name = document.querySelector("#name");
// const msg = document.querySelector("#message")
// const send = document.querySelector("#send")
const canvas = document.getElementById('game');
const context = canvas.getContext("2d");
const messageInput = document.getElementById('messageInput')
const socket = io("http://localhost:3000");

function drawUser(user){
    context.beginPath();
    context.fillStyle = 'black';
    context.arc(user.x, user.y, 20, 0, Math.PI * 2)
    context.fill();
    
    context.textAlign = 'center'
    context.fillText(user.name, user.x, user.y + 30)
    context.fillText(user.message, user.x, user.y - 30)
    context.closePath();
}


var users = {};
socket.on('connect', ()=>{
    const name = 'Guest' + Math.floor(Math.random() * 99999);
    socket.emit('login', name);
});

socket.on('user-connected', user => {
    users[user.clientId] = user;
});

socket.on('users-list', usersList => {
    users = usersList;
})
socket.on('user-disconnected', clientId => {
    delete users[clientId];
})
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    for(var i in users) {
        drawUser(users[i])
    }
    requestAnimationFrame(draw);

}
requestAnimationFrame(draw)