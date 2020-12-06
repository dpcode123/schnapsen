import session from 'express-session';
import dotenv from 'dotenv';
import { redisStore } from './redis_config.js';
dotenv.config();

export default session({
    store: redisStore,
    secret: process.env.SESSION_SECRET!, 
    resave: false, 
    saveUninitialized: false,
    name: 'sessionId',
    cookie: { 
        sameSite: 'strict', 
        //secure: true, // only send cookie over https
        httpOnly: true,
        maxAge: 1000*60*60 // cookie expiry length in ms
    }
});