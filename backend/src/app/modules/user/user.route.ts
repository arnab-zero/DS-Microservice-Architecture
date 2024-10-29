import express, { Router } from "express";
import { UserControllers } from "./user.controller";

const router: Router = express.Router();

router.post("/create-user", UserControllers.createUser);
router.post("/verify", UserControllers.getUsers);
router.put("/:userId", UserControllers.updateNotificationsReadController);

export const UserRouter = router;
