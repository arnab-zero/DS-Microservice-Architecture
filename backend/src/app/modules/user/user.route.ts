import express, { Router } from "express";
import { UserControllers } from "./user.controller";

const router: Router = express.Router();

router.post("/create-user", UserControllers.createUser);
router.get("", UserControllers.getUsers);

export const UserRouter = router;
