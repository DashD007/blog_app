const protectedRoute = (req,res,next) => {
    const {user} = req.session;
    if(user?.roleName != "admin"){
        return res.redirect("/dashboard");
    }
    next();
}

export default protectedRoute;