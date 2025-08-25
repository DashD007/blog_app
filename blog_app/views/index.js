import {Router} from 'express';
import ensureAuth from '../middlewares/auth.middleware.js';
import protectedRoute from '../middlewares/protectRoute.middleware.js';
import attachUserRole from "../middlewares/role.middleware.js";

const router = Router();

router.get("/login",(req,res) => {
    try {
        res.render('login');
    } catch (error) {
        res.render('error',{error})
    }
});


router.get("/dashboard",ensureAuth,attachUserRole,(req,res) => {
    try {
        res.render('dashboard')
    } catch (error) {
        res.render('error',{error})
    }
});

router.get("/categorymaster",ensureAuth,protectedRoute,attachUserRole,(req,res) => {
    try {
        res.render('categorymaster');
    } catch (error) {
        res.render('error',{error})
    }
});

router.get("/usermaster",ensureAuth,protectedRoute,attachUserRole,(req,res) => {
    try {
        res.render('usermaster');
    } catch (error) {
        res.render('error',{error})
    }
})

router.use("/blog",ensureAuth,attachUserRole,(req,res) => {
    try {
        const [_,categorySlug,titleSlug] = req?.originalUrl.split("/");
        res.render('blog',{categorySlug,titleSlug});
    } catch (error) {
        res.render('error',{error})
    }
});


router.use("/",(req,res) => {
    res.render('error')
})

export default router;