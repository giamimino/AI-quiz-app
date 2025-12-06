import { FireStoreRooms } from "@/types/firestore";

export function FindWinner(room: FireStoreRooms): string {
    if (!room) return "1";
    const players = room.players;
    let accPlayer: any = { score: 0 };
    for (const player of players) {
      if (Number(player.score) > accPlayer.score) {
        accPlayer = { id: player.id, score: player.score };
      }
    }

    return accPlayer.id as string;
  }