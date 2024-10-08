import { Request, Response } from "express";
import { Post } from "./post.interface";
import { PostServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const post: Post = req.body;
    const { username, postDetail } = post;
    if (!username || !postDetail) {
      return res.status(400).json({ message: "Post detail is required." });
    }
    const result = await PostServices.createPostIntoDB(post);
    console.log("Post data: ", post);
    res.status(200).json({
      success: true,
      message: "New post created successfully!",
      data: result,
    });
  } catch (err) {
    console.log("Error occurred while creating new post:", err);
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const result = await PostServices.getPostsIntoDB();
    res.status(200).json({
      success: true,
      message: "Collected all posts data.",
      data: result,
    });
  } catch (err) {
    console.log("Error occurred while fetching posts: ", err);
  }
};

export const PostControllers = {
  createPost,
  getAllPosts,
};
