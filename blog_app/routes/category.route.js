import {Router} from "express";
import { createCategory, deleteCategory, listCategory, updateCategory } from "../controllers/category.controller.js";
import ensureAuth from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/create",ensureAuth,createCategory);
router.patch("/update",ensureAuth,updateCategory);
router.delete("/delete",ensureAuth,deleteCategory);
router.get("/list",ensureAuth,listCategory);


export default router;