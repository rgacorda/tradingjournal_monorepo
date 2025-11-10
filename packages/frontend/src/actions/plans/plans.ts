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

export const getPlans = async () => {
  try {
    const res = await api.get("/plan/");
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Get plans failed");
  }
};

type Plan = {
  name: string;
  // content?: string;
};

export const createPlan = async (data: Plan) => {
  try {
    const res = await api.post("/plan/", data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Create plan failed");
  }
};

export const getPlanById = async (id: string | null) => {
  if (!id) return;
  try {
    const res = await api.get(`/plan/${id}`);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Get plan failed");
  }
};

export const updatePlan = async (id: string | null, data: Plan) => {
  if (!id) return;
  try {
    const res = await api.put(`/plan/${id}`, data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Edit plan failed");
  }
};

export const deletePlan = async (id: string | null) => {
  if (!id) return;
  try {
    const res = await api.delete(`/plan/${id}`);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Delete plan failed");
  }
};
