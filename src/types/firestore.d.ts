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
  players: { name: string, id: string, username: string }[];
  bannedPlayers: { id: string }[]
}
