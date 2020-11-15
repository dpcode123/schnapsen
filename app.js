import path from 'path';
const __dirname = path.resolve();
import http from 'http';
import express from 'express';
import session from 'express-session';


import redis from 'redis';
import connectRedis from 'connect-redis';

const RedisStore = connectRedis(session);

const redisClient = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});




const app = express();
const server = http.createServer(app);
import socketio from 'socket.io';
const io = socketio(server);

import roomRouter from './routers/RoomRouter.js';
import loginRouter from './routers/LoginRouter.js';
import registerRouter from './routers/RegisterRouter.js';
import mainRouter from './routers/MainRouter.js';

import passport from 'passport';
import flash from 'express-flash';





// Play sessions map
const playSessions = new Map();

import initializePassport from './auth/passportConfig.js';
initializePassport(passport);

import SocketioController from './controllers/SocketioController.js';

// View engine
app.set('view engine', 'ejs');

// JSON
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    store: new RedisStore({client: redisClient}),
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
