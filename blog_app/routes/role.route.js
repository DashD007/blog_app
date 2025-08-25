import {Router} from "express";
import { createRole, getRolesList } from "../controllers/role.controller.js";
import ensureAuth from "../middlewares/auth.middleware.js";


const router = Router();

router.get("/list",ensureAuth,getRolesList);
router.post("/create",ensureAuth,createRole);

export default router;