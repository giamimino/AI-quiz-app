export interface FireStoreRooms {
  id: string;
  title: string;
  topic: string;
  deadline: string;
  createdBy: string;
  public: boolean;
  questions_length: number;
  players_limit: number;
  players: { name: string, id: string, username: string }[];
  createdAt: Date;
}
