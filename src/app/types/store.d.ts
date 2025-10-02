export interface Challenge {
  question: string,
  options: string[],
  answer: string,
}

export interface ChallengeState {
  challenge: Challange[] | null
  setChallenge: (challenge: Challenge[]) => void
  clearChallenge: () => void
}