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
      userId 
    }: { 
      userId: string 
    } = 
      await req.json()
    if(!userId) return errorResponse(GENERIC_ERROR)
    const challenges = (await prisma.user.findUnique({
      where: { id: userId },
      select: {
        challenges: {
          select: {
            title: true,
            description: true,
            topic: true,
            type: true,
          }
        }
      }
    }))?.challenges

    if(!challenges) return errorResponse(GENERIC_ERROR)

    return NextResponse.json({
      success: true,
      challenges
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.")
  }
}