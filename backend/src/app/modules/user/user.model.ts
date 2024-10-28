import { Model, Schema, model } from "mongoose";
import { User } from "./user.interface";

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  notificationsRead: { type: [String], default: [] },
});

export const UserModel = model<User>("User", userSchema);
