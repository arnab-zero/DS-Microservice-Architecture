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

export const UserServices = {
  createUserIntoDB,
  getUserByEmail,
};
