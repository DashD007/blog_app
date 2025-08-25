import {Router} from "express";
import authRouter from "./auth.route.js";
import blogRouter from "./blog.route.js";
import categoryRouter from "./category.route.js"
import commentRouter from "./comment.route.js";
import userRouter from "./user.route.js";
import roleRouter from "./role.route.js";

const router = Router();

router.use("/auth",authRouter);
router.use("/blog",blogRouter);
router.use("/category",categoryRouter);
router.use("/comment",commentRouter);
router.use("/user",userRouter);
router.use("/role",roleRouter);

export default router;