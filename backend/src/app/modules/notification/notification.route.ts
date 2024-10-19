import { NotificationController } from "./notification.controller";
import express, { Router } from "express";

const router: Router = express.Router();
router.post("/create-notification", NotificationController.createNotification);
router.get("/get-notifications", NotificationController.getNotifications);

export const NotificationRouter = router;
