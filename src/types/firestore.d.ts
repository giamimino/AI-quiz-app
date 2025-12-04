export interface FireStoreRooms {
  id: string;
  title: string;
  topic: string;
  deadline: string;
  createdBy: string;
  createdAt: string;
  start: boolean;
  public: boolean;
  questions_length: number;
  players_limit: number;
  questions_generate_status: boolean;
  status: "starting" | "playing" | "ending" | "end"
  players: {
    name: string;
    id: string;
    score: number | null
    username: string;
    image: string;
    answers: null | { questionId: string; answer: string }[];
    finished: null | { finishedAt: string };
  }[];
  bannedPlayers: { id: string }[];
  questions:
    | {
        id: string;
        question: string;
        options: string[];
        answer: string;
      }[]
    | null;
}
