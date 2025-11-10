import { create } from "zustand";

type TradeUIState = {
  editOpen: boolean;
  deleteOpen: boolean;
  selectedTradeId: string | null;
  filter: string | undefined;

  setEditOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
  setSelectedTradeId: (id: string | null) => void;
  setFilter: (filter: string | undefined) => void;
};

export const useTradeUIStore = create<TradeUIState>((set) => ({
  editOpen: false,
  deleteOpen: false,
  selectedTradeId: null,
  filter: undefined,

  setEditOpen: (open) => set({ editOpen: open }),
  setDeleteOpen: (open) => set({ deleteOpen: open }),
  setSelectedTradeId: (id) => set({ selectedTradeId: id }),
  setFilter: (filter) => set({ filter }),
}));
