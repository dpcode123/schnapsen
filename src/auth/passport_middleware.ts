import { CustomRequest, CustomResponse } from "../ts/interfaces";

export function userAuthenticated (req: CustomRequest, res: CustomResponse, next: () => any) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

export function userNotAuthenticated (req: CustomRequest, res: CustomResponse, next: () => void) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}
