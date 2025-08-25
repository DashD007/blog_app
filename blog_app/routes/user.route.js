import {Router} from "express";
import { getAllUsers,getUserAndRoleCount } from "../controllers/user.controller.js";
import ensureAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/list",ensureAuth,getAllUsers);
router.get('/count',getUserAndRoleCount);

export default router;