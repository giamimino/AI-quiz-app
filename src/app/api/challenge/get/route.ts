import { CHALLANGE_NOT_FOUND_ERROR, GENERIC_ERROR } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: true,
    message
  })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") ?? null

    if (!id)
      return errorResponse(GENERIC_ERROR)

    const challenge = await prisma.challenge.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        type: true,
        creator: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
        createdAt: true,
      },
    });
    if (!challenge)
      return errorResponse(CHALLANGE_NOT_FOUND_ERROR)

    const isFinished = await prisma.attempt.findFirst({
      where: { challengeId: challenge.id },
      select: {
        finishedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      challenge,
      finishedAt: isFinished?.finishedAt
    });
  } catch (err) {
    console.log(err);
    return errorResponse(GENERIC_ERROR)
  }
}
