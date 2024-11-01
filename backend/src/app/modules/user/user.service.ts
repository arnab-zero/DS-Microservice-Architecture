import { User } from "./user.interface";
import { UserModel } from "./user.model";

const createUserIntoDB = async (user: User) => {
  const result = await UserModel.create(user);
  return result;
};

const getUserByEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const result = await UserModel.findOne({ email: email, password: password });
  return result;
};

const updateNotificationsReadService = async (
  userId: string,
  notificationId: string
) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { notifications: notificationId } }, // Add notificationId if it doesn't exist
      { new: true } // Return the updated document
    );

    return updatedUser; // Return the updated user or null if not found
  } catch (error) {
    throw new Error(`Error updating notifications: ${error}`);
  }
};

const getUserByEmailOnly = async ({ email }: { email: string }) => {
  const result = await UserModel.findOne({ email: email });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getUserByEmail,
  getUserByEmailOnly,
  updateNotificationsReadService,
};
