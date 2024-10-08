import { NotificationController } from "./notification.controller";
import express, { Router } from "express";

const router: Router = express.Router();
router.post("/create-notification", NotificationController.createNotification);
router.get("", NotificationController.getNotifications);

export const NotificationRouter = router;
