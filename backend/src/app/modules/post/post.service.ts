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

export const PostServices = {
  createPostIntoDB,
  getPostsIntoDB,
};
