import { Answers, Question } from "./global";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  slug: string;
  topic: string;
  type: "AI" | "CUSTOM";
  attempts: { finishedAt: Date | null }[];
}

export interface ChallengeState {
  challenge: Challange[] | [];
  setChallenge: (challenge: Challenge[]) => void;
  clearChallenge: () => void;
  pushChallenge: (challenge: Challenge) => void;
}

export interface CurrentChallenge {
  position: number;
  count: number;
  questions: Question[];
  answers: Answers[];
}

export interface CurrentChallengeStore {
  curChallenge: CurrentChallenge | null;
  setCurChallenge: (curChallenge: CurrentChallenge) => void;
  clearCurChallenge: () => void;
}

export interface TopicState {
  topic: string;
  reactionCount: bigint;
  challengeId: string;
}

export interface TopicStore {
  topics: TopicState[];
  setTopics: (topics: TopicState[]) => void;
  pushTopic: (topic: TopicState) => void;
  clearTopics: () => void;
}
