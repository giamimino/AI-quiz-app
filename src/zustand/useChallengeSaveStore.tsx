import { ChallengeState } from "@/app/types/store";
import { create } from "zustand";


export const useChallengeSaveStore = create<ChallengeState>((set) => ({
  challenge: null,
  setChallenge: (challenge) => set({ challenge }),
  clearChallenge: () => set({ challenge: null })
}))