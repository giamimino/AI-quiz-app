export interface Children {
  children: React.ReactNode
}

export interface QuizObject {
  id: string,
  question: string,
  aiGenerated: boolean;
  options: string[],
  answer: string,
}

export interface ChallengeReview {
  title: string,
  description: string,
  topic: string,
  type: "AI" | "CUSTOM",
  creator: { name: string, username: true, id: true }
  createdAt: string,
}

export interface Option {
  id: string,
  option: string,
  isCorrect: boolean
}

export interface Question {
  id: string,
  question: string,
  aiGenerated: boolean,
  options: Option[]
}

export interface Answers {
  questionId: string,
  optionId: string,
  isCorrect: boolean,
}