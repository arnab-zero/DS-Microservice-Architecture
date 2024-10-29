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

    const existingAccounts = await UserServices.getUserByEmailOnly({ email });
    if (existingAccounts) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already registered." });
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
    if (!result) {
      return res.status(200).json({
        authSuccess: false,
        message: "No user found with these credentials.",
        data: null,
      });
    }
    res.status(200).json({
      authSuccess: true,
      message: "User data fetched successfully.",
      data: result,
    });
  } catch (err) {
    console.log("Error occurred while fetching user info: ", err);
  }
};

const updateNotificationsReadController = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params; // Extract userId from request parameters
  const { notificationId } = req.body; // Extract notificationId from request body

  try {
    const updatedUser = await UserServices.updateNotificationsReadService(
      userId,
      notificationId
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser); // Send the updated user back in response
  } catch (error) {
    res.status(500).json({
      message: "Error updating user notifications",
      error: error,
    });
  }
};

export const UserControllers = {
  createUser,
  getUsers,
  updateNotificationsReadController,
};
