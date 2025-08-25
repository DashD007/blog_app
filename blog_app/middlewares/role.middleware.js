function attachUserRole(req, res, next) {
    const {user} = req.session;
    res.locals.role = user?.roleName;
    next();
}

export default attachUserRole;