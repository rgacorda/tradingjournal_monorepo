import { create } from "zustand";

type PlanUIState = {
  editOpen: boolean;
  deleteOpen: boolean;
  selectedPlanId: string | null;
  setEditOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
  setSelectedPlanId: (id: string | null) => void;
};

export const usePlanUIStore = create<PlanUIState>((set) => ({
  editOpen: false,
  deleteOpen: false,
  selectedPlanId: null,
  setEditOpen: (open) => set({ editOpen: open }),
  setDeleteOpen: (open) => set({ deleteOpen: open }),
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
}));
