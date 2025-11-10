import api from "@/lib/axios";
import { AxiosError } from "axios";

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterCredentials = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  // phone: string;
};

// ✅ Reusable error handler
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

export async function Register(data: RegisterCredentials) {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Registration failed");
  }
}

export async function Login(data: LoginCredentials) {
  try {
    const res = await api.post("/auth/login", data, { withCredentials: true });
    console.log(res.data);
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Login failed");
  }
}

export async function Logout() {
  try {
    const res = await api.post("/auth/logout", {}, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Logout failed");
  }
}

export async function ForgotPassword(email: string) {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Forgot password request failed");
  }
}

export async function VerifyEmail(token: string) {
  try {
    const res = await api.post("/auth/verify-email", { token });
    return res.data;
  } catch (error: unknown) {
    handleAxiosError(error, "Email verification failed");
  }
}

