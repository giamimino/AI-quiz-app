export interface Children {
  children: React.ReactNode
}

export interface QuizObject {
  id: string,
  question: string,
  aiGenerated?: boolean;
  options: string[],
  answer: string,
}