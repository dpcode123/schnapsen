const path = require('path');
const http = require('http');
const express = require('express');
const session = require('express-session');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

const roomRouter = require('./routers/roomRouter');
const loginRouter = require('./routers/loginRouter');
const registerRouter = require('./routers/registerRouter');
const mainRouter = require('./routers/mainRouter');

const passport = require('passport');
const flash = require('express-flash');


// Play sessions map
const playSessions = new Map();

const initializePassport = require("./auth/passportConfig");
initializePassport(passport);


const SocketioController = require('./controllers/SocketioController');

// View engine
app.set('view engine', 'ejs');

// JSON
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: { sameSite: 'strict' }
}));

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());;

// Routers
app.use('/room', roomRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/', mainRouter);

// Socket.io controller
const socketioController = new SocketioController(io, playSessions);

// Port number
const PORT = process.env.PORT || 3000;

// Listen for requests
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
