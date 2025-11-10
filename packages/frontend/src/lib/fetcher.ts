// lib/fetcher.ts
import api from "./axios"; // your configured Axios instance

export const fetcher = (url: string) =>
  api
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      // You can customize error handling here
      throw error;
    });
