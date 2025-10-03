export interface Children {
  children: React.ReactNode
}

export interface QuizObject {
  id: string,
  question: string,
  options: string[],
  answer: string,
}