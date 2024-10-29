import { Post } from "./post.interface";
import { PostModel } from "./post.model";

const createPostIntoDB = async (post: Post) => {
  const result = await PostModel.create(post);
  return result;
};

const getPostsIntoDB = async () => {
  const result = await PostModel.find();
  return result;
};

const getPostById = async (postId: string) => {
  try {
    const post = await PostModel.findById(postId).exec();
    return post;
  } catch (error) {
    throw new Error("Error fetching post: " + error);
  }
};

export const PostServices = {
  createPostIntoDB,
  getPostsIntoDB,
  getPostById,
};
