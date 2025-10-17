export interface Challenge {
  id: string,
  title: string,
  description: string,
  slug: string,
  topic: string,
  type: "AI" | "CUSTOM"
}

export interface ChallengeState {
  challenge: Challange[] | null
  setChallenge: (challenge: Challenge[]) => void
  clearChallenge: () => void
}