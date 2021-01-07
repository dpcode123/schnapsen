import path from 'path';
import http from 'http';
import express from 'express';
import passport from 'passport';
import helmet from 'helmet';
import flash from 'express-flash';
import session from '../config/session_config.js';
import roomRouter from '../routers/RoomRouter.js';
import loginRouter from '../routers/LoginRouter.js';
import registerRouter from '../routers/RegisterRouter.js';
import userSettingsController from '../routers/UserSettingsRouter.js';
import mainRouter from '../routers/MainRouter.js';
import adminRouter from '../routers/AdminRouter.js';
import initializePassport from '../config/passport_config.js';


export default class ExpressLoader {

    app: express.Application;
    server: http.Server;
    
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);

        initializePassport(passport);

        // View engine
        this.app.set('view engine', 'ejs');

        // Helmet
        this.app.use(helmet());

        // JSON
        this.app.use(express.json());

        // if behind a proxy
        //this.app.set('trust proxy', 1);

        // Static folders
        const __dirname = path.resolve();
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.static(path.join(__dirname, 'public-img')));

        // Session
        this.app.use(session);

        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());;

        // Routers
        this.app.use('/room', roomRouter);
        this.app.use('/login', loginRouter);
        this.app.use('/user-settings', userSettingsController);
        this.app.use('/register', registerRouter);
        this.app.use('/admin', adminRouter);
        this.app.use('/', mainRouter);

    }
    
    getServer(): http.Server {
        return this.server;
    }

}
