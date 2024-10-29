import express, { Router } from "express";
import { PostControllers } from "./post.controller";

const router: Router = express.Router();

router.post("/create-post", PostControllers.createPost);
router.get("/get-posts", PostControllers.getAllPosts);
router.get("/:postId", PostControllers.getPostById);

export const PostRouter = router;
