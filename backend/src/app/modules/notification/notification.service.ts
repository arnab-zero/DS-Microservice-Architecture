import { Notification } from "./notification.interface";
import { NotificationModel } from "./notification.model";

const saveNotificationIntoDB = async (notification: Notification) => {
  const result = await NotificationModel.create(notification);
  return result;
};

const getNotificationsFromDB = async () => {
  const result = await NotificationModel.find();
  return result;
};

export const NotificationServices = {
  saveNotificationIntoDB,
  getNotificationsFromDB,
};
