
var express = require("express");
var app = express();

const messages = {
    name:'John',
    message: "Hello"
}
app.use(express.static(__dirname))

app.get('/messages', (req,res)=>{
    res.send(messages)
})

var PORT = 3000;
var server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
})
