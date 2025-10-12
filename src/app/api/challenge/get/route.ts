import { CHALLANGE_NOT_FOUND_ERROR, GENERIC_ERROR } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}

export async function POST(req: Request) {
  try {
    const { 
      challengeId 
    }: { 
      challengeId: string 
    } =
      await req.json()

    if(!challengeId) return errorResponse(GENERIC_ERROR)

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        title: true,
        description: true,
        topic: true,
        type: true,
        creator: {
          select: {
            name: true
          }
        },
        createdAt: true,
      }
    })
    if(!challenge) return errorResponse(CHALLANGE_NOT_FOUND_ERROR)

    return NextResponse.json({
      success: true,
      challenge
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.")
  }
}