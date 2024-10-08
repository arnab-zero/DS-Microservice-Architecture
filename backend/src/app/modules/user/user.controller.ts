import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { User } from "./user.interface";

const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const { email, username, password } = user;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required." });
    }
    const result = await UserServices.createUserIntoDB(user);
    console.log("User data: ", user);
    res.status(200).json({
      success: true,
      message: "New user created successfully",
      data: result,
    });
  } catch (err) {
    console.log("Error ocurred while creating new user: ", err);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const { email, password } = user;
    const result = await UserServices.getUserByEmail({ email, password });
    res.status(200).json({
      success: true,
      message: "User data fetched successfully.",
      data: result,
    });
  } catch (err) {
    console.log("Error occurred while fetching user info: ", err);
  }
};

export const UserControllers = {
  createUser,
  getUsers,
};