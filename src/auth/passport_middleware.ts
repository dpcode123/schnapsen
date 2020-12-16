import { Authority } from "../ts/enums.js";
import { CustomRequest, CustomResponse } from "../ts/interfaces.js";

// user is logged in
export function isUserAuthenticated (req: CustomRequest, res: CustomResponse, next: () => any) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// user is NOT logged in
export function isUserNotAuthenticated (req: CustomRequest, res: CustomResponse, next: () => void) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

// user has role Admin
export function isUserAdmin (req: CustomRequest, res: CustomResponse, next: () => any) {
    if (userHasRole(req, Authority.ADMIN)) {
        return next();
    }
    res.redirect('/login');
}

// user has role Player
export function isUserPlayer (req: CustomRequest, res: CustomResponse, next: () => any) {
    if (userHasRole(req, Authority.PLAYER)) {
        return next();
    }
    res.redirect('/login');
}

// user has role
export function userHasRole(req: CustomRequest, role: string): boolean {
    return req.session.passport.user.roles.some((authRole: {name: string}) => authRole.name === role);
}