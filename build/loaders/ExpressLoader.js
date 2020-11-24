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
        this.app = express();
        this.server = http.createServer(this.app);
        this.RedisStore = connectRedis(session);
        this.redisClient = redis.createClient(process.env.REDIS_URL, { no_ready_check: true });
        initializePassport(passport);
        // View engine
        this.app.set('view engine', 'ejs');
        // JSON
        this.app.use(express.json());
        // Static folder
        const __dirname = path.resolve();
        this.app.use(express.static(path.join(__dirname, 'public')));
        // Session
        this.app.use(session({
            store: new this.RedisStore({ client: this.redisClient }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                sameSite: 'strict',
                //secure: true, // only send cookie over https
                httpOnly: true,
                maxAge: 1000 * 60 * 60 // cookie expiry length in ms
            }
        }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        ;
        // Routers
        this.app.use('/room', roomRouter);
        this.app.use('/login', loginRouter);
        this.app.use('/register', registerRouter);
        this.app.use('/', mainRouter);
    }
    getServer() {
        return this.server;
    }
}
