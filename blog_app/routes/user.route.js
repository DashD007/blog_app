import {Router} from "express";
import { getAllUsers,getUserAndRoleCount,deleteUser, updateUser } from "../controllers/user.controller.js";
import ensureAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/list",ensureAuth,getAllUsers);
router.get('/count',getUserAndRoleCount);
router.delete("/delete",ensureAuth,deleteUser);
router.patch("/update",ensureAuth,updateUser);

export default router;