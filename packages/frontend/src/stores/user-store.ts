import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

type User = {
  firstname: string;
  middlename: string | null;
  lastname: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  timezone: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

// Wrap middleware type properly to avoid inference issues
// type UserStateWithPersist = PersistOptions<UserState> & {
//   name: string;
// };

export const useUserStore = create<UserState>()(
  persist<UserState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-store', // name in localStorage
    } satisfies PersistOptions<UserState>
  )
);
