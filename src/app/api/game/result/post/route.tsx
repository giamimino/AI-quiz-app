import { db } from "@/configs/firebase";
import { GENERIC_ERROR, ROOM_CANT_FOUND_ERROR } from "@/constants/errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FireStoreRooms } from "@/types/firestore";
import { FindWinner } from "@/utils/FindWinner";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

const collection = "rooms";

export async function POST(req: Request) {
  try {
    const { roomId, userId }: { roomId: string; userId?: string } =
      await req.json();

    if (!roomId) return errorResponse(GENERIC_ERROR);

    const existingRoom = await prisma.game.findUnique({
      where: { roomId },
      select: {
        id: true
      }
    })

    if(existingRoom) return errorResponse(GENERIC_ERROR)

    const roomRef = doc(db, collection, roomId);
    const snap = await getDoc(roomRef);

    if (!snap.exists()) return errorResponse(ROOM_CANT_FOUND_ERROR);

    const data = snap.data() as FireStoreRooms;

    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    if (
      data.createdBy !== effectiveUserId ||
      !data.start ||
      data.status !== "ending" ||
      !data.players.every((p) => p.finished)
    )
      return errorResponse(GENERIC_ERROR);
    const winnerId = FindWinner(data)

    const createGame = await prisma.$transaction(async (tx) => {
      const game = await tx.game.create({
        data: {
          winnerId,
          type: "quickclash",
          roomId
        },
        select: {
          id: true
        }
      })

      const playersData = data.players.map(p => ({
        gameId: game.id,
        userId: p.id,
        score: p.score,
      }))

      await tx.gamePlayers.createMany({ data: playersData})

      return game
    })


    if(!createGame) 
      return errorResponse(GENERIC_ERROR)

    await deleteDoc(roomRef)

    return NextResponse.json({
      success: true,
      gameId: createGame.id,
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
