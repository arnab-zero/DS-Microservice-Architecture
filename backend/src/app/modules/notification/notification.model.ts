import { model, Schema } from "mongoose";
import { Notification } from "./notification.interface";

const notificationSchema = new Schema<Notification>({
  notificationDetail: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export const NotificationModel = model<Notification>(
  "Notification",
  notificationSchema
);
