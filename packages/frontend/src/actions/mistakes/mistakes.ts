import api from "@/lib/axios";
import { AxiosError } from "axios";

export type Mistake = {
  id: string;
  name: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

// ✅ Central error handler to avoid code duplication
const handleAxiosError = (error: unknown, fallbackMessage: string): never => {
  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error(
      fallbackMessage,
      axiosError.response?.data || axiosError.message
    );
    throw new Error(axiosError.response?.data?.message || fallbackMessage);
  }

  console.error(fallbackMessage, (error as Error).message);
  throw new Error(fallbackMessage);
};

export const getMistakes = async () => {
  try {
    const res = await api.get("/mistake/");
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Get mistakes failed");
  }
};

export const createMistake = async (name: string) => {
  try {
    const res = await api.post("/mistake/", { name });
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Create mistake failed");
  }
};

export const getMistakeById = async (id: string | null) => {
  if (!id) return;
  try {
    const res = await api.get(`/mistake/${id}`);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Get mistake failed");
  }
};

export const updateMistake = async (id: string | null, name: string) => {
  if (!id) return;
  try {
    const res = await api.put(`/mistake/${id}`, { name });
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Edit mistake failed");
  }
};

export const deleteMistakes = async (ids: string[] | null) => {
  if (!ids) return;
  try {
    const res = await api.delete(`/mistake/delete`, {
      data: {
        ids: ids,
      },
    });
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Delete mistake failed");
  }
};
