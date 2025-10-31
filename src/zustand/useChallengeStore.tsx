import { ChallengeState } from "@/app/types/store";
import { create } from "zustand";


export const useChallengeStore = create<ChallengeState>((set) => ({
  challenge: [],
  setChallenge: (challenge) => set({ challenge }),
  clearChallenge: () => set({ challenge: [] }),
  pushChallenge: (challenge) => 
    set((state) => ({
      challenge: [...state.challenge, challenge]
    }))
}))