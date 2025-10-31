import { GENERIC_ERROR } from "@/constants/errors";
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
      userId,
      challengeId
    }: { 
      userId: string,
      challengeId?: string
    } = 
      await req.json()
    if(!userId) return errorResponse(GENERIC_ERROR)

    let challenges;
    if(challengeId) {
      challenges = await prisma.challenge.findUnique({
        where: { id: challengeId },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          topic: true,
          type: true,
        }
      })
    } else {
      challenges = (await prisma.user.findUnique({
        where: { id: userId },
        select: {
          challenges: {
            select: {
              id: true,
              title: true,
              description: true,
              slug: true,
              topic: true,
              type: true,
              attempts: {
                where: { userId },
                select: {
                  finishedAt: true
                } 
              }
            }
          }
        }
      }))?.challenges
    }
    
    if(!challenges) return errorResponse(GENERIC_ERROR)

    return NextResponse.json({
      success: true,
      newChallenge: challengeId ? true : false,
      challenges
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.")
  }
}