const { json } = require('body-parser');
const { WebcastPushConnection } = require('tiktok-live-connector');

let ultimocomentario

let ultimoregalo



let tiktokUsername = "jane_uwu"

let tiktokChatConnection = new WebcastPushConnection(tiktokUsername);

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require("path");

 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'www')));
 


app.post("/usuario", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.body.arroba)
    tiktokUsername = req.body.arroba
})



app.get("/form", (req, res) => {
    res.setHeader('Content-Type', 'application/json');


    res.send(JSON.stringify({
        usuario: req.body.usuario || ultimocomentario.usuario,
        comentario: req.body.comentario || ultimocomentario.comentario,
        fotoxd: req.body.fotoxd || ultimocomentario.foto
    }));

})

app.get("/regalos", (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (ultimoregalo != undefined) {
        res.send(JSON.stringify({
            usuario: req.body.usuario || ultimoregalo.usuario,
            regalo: req.body.regalo || ultimoregalo.regalo,
            cantidad: req.body.cantidad || ultimoregalo.cuantos,
            enviar: req.body.enviar || true
        }));
    } else {
        res.send(JSON.stringify({
            usuario: req.body.usuario || undefined,
            regalo: req.body.regalo || undefined,
            cantidad: req.body.cantidad || undefined,
            enviar: req.body.enviar || false
        }));   
    }
})


tiktokChatConnection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
}).catch(err => {
    console.error('Failed to connect', err);
})

tiktokChatConnection.on('chat', data => {
    ultimocomentario = {usuario: data.uniqueId, comentario: data.comment, foto: data.profilePictureUrl}
    console.log(ultimocomentario)
})

tiktokChatConnection.on('gift', data => {
    if (data.giftType === 1 && !data.repeatEnd) {
        ultimoregalo = {usuario: data.uniqueId, regalo: data.giftName, cuantos: data.repeatCount}
    } else {
        ultimoregalo = {usuario: data.uniqueId, regalo: data.giftName, cuantos: data.repeatCount}

    }
})

app.listen(3000, function () {
    console.log('Server is running. Point your browser to: http://localhost:3000');
});