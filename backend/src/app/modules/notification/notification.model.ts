import { model, Schema } from "mongoose";
import { Notification } from "./notification.interface";

const notificationSchema = new Schema<Notification>({
  username: { type: String, required: true },
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const NotificationModel = model<Notification>(
  "Notification",
  notificationSchema
);
