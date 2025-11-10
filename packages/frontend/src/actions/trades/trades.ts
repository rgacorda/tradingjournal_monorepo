import api from "@/lib/axios";
import { AxiosError } from "axios";

export type Trade = {
  id: string;
  ticker: string;
  side: string;
  quantity: number;
  entry: number;
  exit: number;
  fees: number;
  grade: number;
  mistakes: string[];
  notes: string;
  date: string;
  time: string;
  realized: number;
  security: string;
  broker: string;
  planId: string;
  accountId: string;
};

// ✅ Central error handler to avoid code duplication
const handleAxiosError = (error: unknown, fallbackMessage: string): never => {
  if (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error
  ) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error(fallbackMessage, axiosError.response?.data || axiosError.message);
    throw new Error(axiosError.response?.data?.message || fallbackMessage);
  }

  console.error(fallbackMessage, (error as Error).message);
  throw new Error(fallbackMessage);
};

export const getTrades = async () => {
  try {
    const res = await api.get("/trade/");
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Get trades failed");
  }
};

export const createTrade = async (data: Trade) => {
  try {
    const res = await api.post("/trade/", data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Create trade failed");
  }
};

export const getTradebyId = async (id: string | null) => {
  if (!id) return;
  try {
    const res = await api.get(`/trade/${id}`);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Get trade failed");
  }
};

export const updateTrade = async (id: string | null, data: Partial<Trade>) => {
  if (!id) return;
  try {
    const res = await api.put(`/trade/${id}`, data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Edit trade failed");
  }
};

export const deleteTrades = async (ids: string[] | null) => {
  if (!ids) return;
  try {
    const res = await api.delete(`/trade/delete`, {
      data: {
        ids: ids,
      },
    });
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Delete trade failed");
  }
};
