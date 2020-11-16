import path from 'path';
import http from 'http';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import passport from 'passport';
import flash from 'express-flash';

import roomRouter from '../routers/RoomRouter.js';
import loginRouter from '../routers/LoginRouter.js';
import registerRouter from '../routers/RegisterRouter.js';
import mainRouter from '../routers/MainRouter.js';

import initializePassport from '../auth/passport_config.js';

export default class ExpressLoader {
    constructor() {

        const app = express();
        const server = http.createServer(app);

        const RedisStore = connectRedis(session);
        const redisClient = redis.createClient(
            process.env.REDIS_URL, 
            {no_ready_check: true}
        );

        initializePassport(passport);
            
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
            })
        );

        app.use(express.urlencoded({ extended: false }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());;

        // Routers
        app.use('/room', roomRouter);
        app.use('/login', loginRouter);
        app.use('/register', registerRouter);
        app.use('/', mainRouter);

        this.getServer = function() {
            return server;
        }

    }
}











