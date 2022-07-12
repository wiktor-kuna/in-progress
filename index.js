const {port, channel} = require('./config');
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const app = express();
require('./utils/db');
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, 
	max: 100,
	standardHeaders: true, 
	legacyHeaders: false, 
});

const cookieParser = require('cookie-parser');
const {engine} = require('express-handlebars');

const { handleError } = require('./utils/errors');
const { mainRouter } = require('./routers/mainRouter');
const {gamesRouter} = require('./routers/gamesRouter');

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(limiter)
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/static', express.static('public'));

app.engine('.hbs', engine({
    extname: '.hbs',
}));

app.set('view engine', '.hbs');
app.set('views', './views');

app.use('/main', mainRouter);
app.use('/games', gamesRouter);
app.get('/chat', (req, res) => {
    res.render('chat', {layout: 'chat', login: req.cookies.user.login});
});

app.get('/', (req, res) => {
    res.redirect('/main');
    res.end();
});

// app.get('*', (req, res) => {
//     res.render('error', {message: "404. nie ma takiego zasobu"});
// });

app.use(handleError);

io.on('connection', (socket) => {
    console.log('a new user is connected');
    socket.emit('reset', '');

    if (channel.content){
        socket.emit('start', (() => JSON.stringify(channel.content))());
    } 
    
    socket.on('disconnect', () => {
        console.log('an "old" user :) is disconnected');
    });

    socket.on('chat message', (msg) => {
      const message = JSON.parse(msg);
      const date = new Date();

      if ((message.nick.toLowerCase() === channel.admin) && (message.input.toLowerCase() === "clear;")) {
        channel.content = [];
        io.emit('reset', '');
      } else {
        // console.log(`${message.nick} [${date.toLocaleTimeString('pl')}]:\n${message.input}\n`);
        io.emit('answer', (() => JSON.stringify({...message, date: date.toLocaleTimeString('pl')}))());
        channel.content.push({...message, date: date.toLocaleTimeString('pl')});}
    });
});

server.listen(port, 'localhost', () => {
    console.log(`Server is started at port ${port}.`)
});