import express, { Router } from "express";
import { PostControllers } from "./post.controller";

const router: Router = express.Router();

router.post("/create-post", PostControllers.createPost);
router.get("", PostControllers.getAllPosts);

export const PostRouter = router;
