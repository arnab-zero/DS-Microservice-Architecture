import { model, Schema } from "mongoose";
import { Post } from "./post.interface";

const postSchema = new Schema<Post>({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  postDetail: { type: String, required: true },
  filename: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const PostModel = model<Post>("Post", postSchema);
