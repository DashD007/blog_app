import {Router} from 'express';
import ensureAuth from '../middlewares/auth.middleware.js';
import protectedRoute from '../middlewares/protectRoute.middleware.js';
import attachUserPermissions from "../middlewares/role.middleware.js";

const router = Router();

router.get("/login",(req,res) => {
    try {
        return res.render('login');
    } catch (error) {
        return res.render('error',{error})
    }
});

router.get("/forgot",(req,res) => {
    try {
        return res.render('forget');
    } catch (error) {
        return res.render('error',{error})
    }
});

router.use("/forgot/verify",(req,res) => {
    try {
        return res.render('verifyOTP');
    } catch (error) {
        return res.render('error',{error})
    }
});

router.get("/dashboard",ensureAuth,attachUserPermissions,(req,res) => {
    try {
        return res.render('dashboard')
    } catch (error) {
        return res.render('error',{error})
    }
});

router.get("/categorymaster",ensureAuth,protectedRoute,attachUserPermissions,(req,res) => {
    try {
        const {user} = req.session;
        if(user?.permissions.includes("category.count") || user?.permissions.includes("category.list")|| user?.permissions.includes("category.create")){
            return res.render('categorymaster');
        }
        return res.redirect("/dashboard");
    } catch (error) {
        return res.render('error',{error})
    }
});

router.get("/usermaster",ensureAuth,protectedRoute,attachUserPermissions,(req,res) => {
    try {
        return res.render('usermaster');
    } catch (error) {
        return res.render('error',{error})
    }
});

router.get("/rolemaster",ensureAuth,protectedRoute,attachUserPermissions,(req,res) => {
    try {
        return res.render('rolemaster');
    } catch (error) {
        return res.render('error',{error})
    }
});


router.use("/blog",ensureAuth,attachUserPermissions,(req,res) => {
    try {
        const {user} = req.session;
        if(!user?.permissions.includes("blog.get")){
            return res.redirect("/dashboard");
        }
        const [_,categorySlug,titleSlug] = req?.originalUrl.split("/");
        return res.render('blog',{categorySlug,titleSlug});
    } catch (error) {
        return res.render('error',{error})
    }
});


router.use("/",(req,res) => {
    return res.render('error')
})

export default router;