import api from "@/lib/axios";

type ImportTrades = {
  platform: string;
  file: File;
  account: string;
  date: Date | undefined;
};

// Convert date to DATEONLY format (YYYY-MM-DD)
const dateToDateOnlyString = (date: Date): string => {
  try {
    // Get the date components from the local date object
    // This preserves the exact date the user selected in their calendar
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Return only the date portion (no time, no timezone)
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error converting date:", error);
    // Fallback: extract date from ISO string
    return date.toISOString().split('T')[0];
  }
};

export const ImportTradesService = {
  importTrades: (data: ImportTrades) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("platform", data.platform);
    formData.append("accountId", data.account);

    if (data.date) {
      const dateString = dateToDateOnlyString(data.date);
      formData.append("date", dateString);
    } else {
      formData.append("date", "");
    }

    return api.post("/trade/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
