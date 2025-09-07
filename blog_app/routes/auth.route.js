import {Router} from "express";
import { loginUser, registerUser,logoutUser, forgotPassword, validateOTP } from "../controllers/auth.controller.js";
import ensureAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",ensureAuth,registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",validateOTP);

export default router;
