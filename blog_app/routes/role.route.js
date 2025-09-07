import {Router} from "express";
import { createRole, deleteRole, getRolesList, updateRole } from "../controllers/role.controller.js";
import ensureAuth from "../middlewares/auth.middleware.js";


const router = Router();

router.get("/list",ensureAuth,getRolesList);
router.post("/create",ensureAuth,createRole);
router.delete("/delete",ensureAuth,deleteRole);
router.patch("/update",ensureAuth,updateRole);


export default router;