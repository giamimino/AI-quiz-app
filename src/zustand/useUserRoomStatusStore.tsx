import { UserRoomStatusStore } from "@/app/types/store";
import { create } from "zustand";

export const useUserRoomStatusStore = create<UserRoomStatusStore>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
  clearStatus: () => set({ status: null }),
}));
