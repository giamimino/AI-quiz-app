export interface Challenge {
  title: string,
  description: string,
  topic: string,
  type: "AI" | "CUSTOM"
}

export interface ChallengeState {
  challenge: Challange[] | null
  setChallenge: (challenge: Challenge[]) => void
  clearChallenge: () => void
}