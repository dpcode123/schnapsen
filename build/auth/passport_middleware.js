import { Authority } from "../ts/enums.js";
export function isUserAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
export function isUserNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}
export function isUserAdmin(req, res, next) {
    if (userHasRole(req, Authority.ADMIN)) {
        return next();
    }
    res.redirect('/login');
}
export function isUserPlayer(req, res, next) {
    if (userHasRole(req, Authority.PLAYER)) {
        return next();
    }
    res.redirect('/login');
}
export function userHasRole(req, role) {
    return req.session.passport.user.roles.some((authRole) => authRole.name === role);
}
