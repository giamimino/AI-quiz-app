export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string,
}

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
  status: "starting" | "playing" | "ending" | "end";
  startedAt: string | null;
  players: FireStoreRoomPlayers[];
  bannedPlayers: { id: string }[];
  questions:
    | {
        id: string;
        question: string;
        options: string[];
        answer: string;
      }[]
    | null;
  messages: Message[];
}

export interface FireStoreRoomPlayerAnswer {
  questionId: string;
  answer: string;
}

export interface FireStoreRoomPlayers {
  name: string;
  id: string;
  score: number | null;
  username: string;
  image: string;
  answers: null | FireStoreRoomPlayerAnswer[];
  finished: null | { finishedAt: string };
}
