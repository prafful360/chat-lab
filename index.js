const express = require("express");

const app = express();
const path = require("path")
const io = require('socket.io')();

app.listen(80, ()=>{
    console.log("Server is running at port 80");
    io.listen(3000)    
})

app.use(express.static('public'));
app.set('views','./views');
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', (req,res) =>{
    res.render('index.html');
})
var users = {};
function createUser(name, clientId){
    return{
        name: name,
        clientId: clientId,
        x:250,
        y:250,
        message: ''
    }
}

io.on('connection', client => {
    client.on('login',name =>{
        var user = createUser(name, client.id);
        users[client.id] = user;
        client.broadcast.emit('user-connected',user)
        client.emit('users-list', users)
    });
    client.on('message', message => {
        var user = users[client.id];
        user.message = message;
        io.emit('user-updated', user)
    });
    client.on('move',(x,y) => {
        var user = users[id];
        user.x = x;
        user.y = y;
        io.emit('user-updated', user)
    })
    client.on('disconnect', () => {
        delete users[client.id];
        client.broadcast.emit('User-disconnected', client.id)
    })
})
