import { CurrentChallengeStore } from "@/app/types/store";
import { create } from "zustand";



export const useCurrentChallengeStore = create<CurrentChallengeStore>((set) => ({
  curChallenge: null,
  setCurChallenge: (curChallenge) => set({ curChallenge }),
  clearCurChallenge: () => set({ curChallenge: null })
}))