import path from 'path';
import http from 'http';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import socketio from 'socket.io';
import passport from 'passport';
import flash from 'express-flash';

const RedisStore = connectRedis(session);
const redisClient = redis.createClient(
    process.env.REDIS_URL, 
    {no_ready_check: true}
);

const app = express();
const server = http.createServer(app);

const io = socketio(server);

import roomRouter from './routers/room_router.js';
import loginRouter from './routers/login_router.js';
import registerRouter from './routers/register_router.js';
import mainRouter from './routers/main_router.js';


// Play sessions map
const playSessions = new Map();

import initializePassport from './auth/passport_config.js';
initializePassport(passport);

import SocketioController from './controllers/socketio_controller.js';

// View engine
app.set('view engine', 'ejs');

// JSON
app.use(express.json());

// Static folder
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: { 
        sameSite: 'strict', 
        //secure: true, // only send cookie over https
        httpOnly: true,
        maxAge: 60000*60*24 // cookie expiry length in ms
     }
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
