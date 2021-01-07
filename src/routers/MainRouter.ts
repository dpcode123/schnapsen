import express, { Router } from 'express';
import { isUserAuthenticated, isUserAdmin, userHasRole, isUserPlayer } from '../auth/passport_middleware.js';
import { Authority } from '../ts/enums.js';
import { CustomRequest, CustomResponse } from '../ts/interfaces.js';

const router: Router = express.Router();

// Index page
router.get('/', isUserAuthenticated, (req: CustomRequest, res: CustomResponse): void => {
    res.render('index', {
        userdata: {
            username: req.session.passport.user.username,
            id: req.session.passport.user.id,
            isAdmin: userHasRole(req, Authority.ADMIN),
            isPlayer: userHasRole(req, Authority.PLAYER)
        }
    });
});

// Join page
router.get('/join-room', isUserAuthenticated, isUserPlayer, (req: CustomRequest, res: CustomResponse): void => {
    res.render('join-room');
});

// Play page
router.get('/play', isUserAuthenticated, isUserPlayer, (req: CustomRequest, res: CustomResponse): void => {
    const reqSession: any = req.session;
    const roomSessionData = reqSession.roomSessionData;
    res.render('play', roomSessionData);
});

/* // Admin page
router.get('/admin', isUserAuthenticated, isUserAdmin, (req: CustomRequest, res: CustomResponse): void => {
    const usersFromDB = [
        {id: '412', username: 'Johnny', email: 'ssasf@fasas.net'},
        {id: '234', username: 'Peter', email: 'gasdgds@gasdgsd.com'},
        {id: '2421', username: 'Dax', email: 'gsdasd@ddg.net'},
        {id: '4212', username: 'Mike', email: 'ewwegsd@sdgsdgsd.com'}
    ];

    res.render('admin', {
        data: {
            xxx: 'yyy',
            users: usersFromDB
        }
    });
}); */

router.get('/logout', isUserAuthenticated, function(req, res){
    req.logout();
    res.redirect('/');
});

// 404 page
router.use((req: CustomRequest, res: CustomResponse): void => {
    res.status(404).render('404');
});

export default router;