function attachUserPermissions(req, res, next) {
    const {user} = req.session;
    res.locals.username = user?.username;
    res.locals.userId = user?.id;
    res.locals.permissions = user?.permissions;
    next();
}

export default attachUserPermissions;