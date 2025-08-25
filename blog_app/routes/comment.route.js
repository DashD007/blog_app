import {Router} from "express";
import { createComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
import ensureAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create",ensureAuth,createComment);
router.patch("/update",ensureAuth,updateComment);
router.delete("/delete",ensureAuth,deleteComment);

export default router;