import { create } from "zustand";

type AnalyticsUIState = {
  limitFilter: number | undefined;
  setLimitFilter: (limit: number | undefined) => void;
};

export const useAnalyticsUIStore = create<AnalyticsUIState>((set) => ({
  limitFilter: undefined,
  setLimitFilter: (limit) => set({ limitFilter: limit }),
}));
