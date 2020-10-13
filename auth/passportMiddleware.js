const userAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
    return next();
    }
    res.redirect('/login');
}

const userNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

module.exports = {
    userAuthenticated,
    userNotAuthenticated
}