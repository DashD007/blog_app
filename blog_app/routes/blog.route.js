import {Router } from "express";
import ensureAuth from "../middlewares/auth.middleware.js";
import { createBlog, deleteBlog, getBlog, toggleBlogPublish, updateBlog,listBlogs, getCount } from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/create",ensureAuth,upload.single("coverimage"),createBlog);
router.patch("/update",ensureAuth,updateBlog);
router.delete("/delete",ensureAuth,deleteBlog);
router.patch("/toggle",ensureAuth,toggleBlogPublish);
router.get("/:categorySlug/:titleSlug",ensureAuth,getBlog);
router.post("/list",ensureAuth,listBlogs);
router.get("/count",ensureAuth,getCount);


export default router;