import { create } from "zustand";
type Dashboard = {
  title: string;
};

type DashboardUIState = {
  dashboard: Dashboard;
  setDashboard: (dashboard: Dashboard) => void;
};

export const useDashboardStore = create<DashboardUIState>((set) => ({
  dashboard: { title: "" },
  setDashboard: (dashboard) => set({ dashboard }),
}));
