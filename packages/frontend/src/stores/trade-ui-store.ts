import { create } from "zustand";

type TradeUIState = {
  addOpen: boolean;
  editOpen: boolean;
  mistakesOpen: boolean;
  deleteOpen: boolean;
  selectedTradeId: string | null;
  filter: string | undefined;
  limitFilter: number | undefined;

  setAddOpen: (open: boolean) => void;
  setEditOpen: (open: boolean) => void;
  setMistakesOpen: (open: boolean) => void;
  setDeleteOpen: (open: boolean) => void;
  setSelectedTradeId: (id: string | null) => void;
  setFilter: (filter: string | undefined) => void;
  setLimitFilter: (limit: number | undefined) => void;
};

export const useTradeUIStore = create<TradeUIState>((set) => ({
  addOpen: false,
  editOpen: false,
  mistakesOpen: false,
  deleteOpen: false,
  selectedTradeId: null,
  filter: undefined,
  limitFilter: undefined,

  setAddOpen: (open) => set({ addOpen: open }),
  setEditOpen: (open) => set({ editOpen: open }),
  setMistakesOpen: (open) => set({ mistakesOpen: open }),
  setDeleteOpen: (open) => set({ deleteOpen: open }),
  setSelectedTradeId: (id) => set({ selectedTradeId: id }),
  setFilter: (filter) => set({ filter }),
  setLimitFilter: (limit) => set({ limitFilter: limit }),
}));
