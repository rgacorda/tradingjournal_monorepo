import { create } from "zustand";

type AccountUIState = {
  editOpen: boolean;
  deleteOpen: boolean;
  selectedAccountId: string | null;
  setEditOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
  setSelectedAccountId: (id: string | null) => void;
};

export const useAccountUIStore = create<AccountUIState>((set) => ({
  editOpen: false,
  deleteOpen: false,
  selectedAccountId: null,
  setEditOpen: (open) => set({ editOpen: open }),
  setDeleteOpen: (open) => set({ deleteOpen: open }),
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
}));
