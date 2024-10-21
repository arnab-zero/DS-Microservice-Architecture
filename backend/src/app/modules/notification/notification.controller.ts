import { Request, Response } from "express";
import { Notification } from "./notification.interface";
import { NotificationServices } from "./notification.service";

const createNotification = (req: Request, res: Response) => {
  try {
    const notification: Notification = req.body;
    const result = NotificationServices.saveNotificationIntoDB(notification);
    res.status(200).json({
      success: true,
      message: "Notification saved successfully.",
      data: notification,
    });
  } catch (err) { 
    console.log("Error occurred while saving notification info:", err);
  }
};

const getNotifications = async (req: Request, res: Response) => {
  try {
    const result = await NotificationServices.getNotificationsFromDB();
    res.status(200).json({
      success: true,
      message: "Notifications fetched from DB successfully.",
      data: result,
    });
  } catch (err) {
    console.log(
      "Error occurred while fetching notifications info from DB:",
      err
    );
  }
};

export const NotificationController = {
  createNotification,
  getNotifications,
};
