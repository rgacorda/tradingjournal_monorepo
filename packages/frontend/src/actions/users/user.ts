import api from "@/lib/axios";
import { AxiosError } from "axios";

const handleAxiosError = (error: unknown, fallbackMessage: string) => {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error(fallbackMessage, axiosError.response?.data || axiosError.message);
    throw new Error(axiosError.response?.data?.message || fallbackMessage);
  }

  console.error(fallbackMessage, (error as Error).message);
  throw new Error(fallbackMessage);
};

export type User = {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  middlename?: string;
  phone?: string;
  role?: string;
  timezone?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUserData = {
  firstname?: string;
  lastname?: string;
  email?: string;
  timezone?: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// GET /user - Get current user profile
export const getUser = async () => {
  try {
    const res = await api.get("/user/");
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Get user failed");
  }
};

// PUT /user - Update user profile
export const updateUser = async (data: UpdateUserData) => {
  try {
    const res = await api.put("/user/", data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Update user failed");
  }
};

// PUT /user/change-password - Change user password
export const changePassword = async (data: ChangePasswordData) => {
  try {
    const res = await api.put("/user/change-password", data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Change password failed");
  }
};

// DELETE /user - Delete user account
export const deleteUser = async () => {
  try {
    const res = await api.delete("/user/");
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Delete account failed");
  }
};
