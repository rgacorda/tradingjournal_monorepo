"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/auth/check-auth', {
          withCredentials: true,
        });
      } catch (error) {
        // Only redirect if we're not already on the login page
        // The axios interceptor will handle the redirect if needed
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [router]);
}
