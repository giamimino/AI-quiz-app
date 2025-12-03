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
  players: { name: string; id: string; username: string; image: string }[];
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
