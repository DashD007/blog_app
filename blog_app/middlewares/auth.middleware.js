const ensureAuth = (req, res, next) => {
    if (req.session && req.session.user){
        return next();
    }

    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res.status(401).json({ error: "Please log in" });
    }
    return res.redirect('/login');
}

export default ensureAuth;