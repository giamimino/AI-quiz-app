import { CHALLANGE_NOT_FOUND_ERROR, GENERIC_ERROR } from "@/constants/errors";
import { auth } from "@/lib/auth";
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
    
    const userId = searchParams.get("userId") ?? null
    const session = userId ? null : await auth()
    const effectiveUserId = userId ?? session?.user?.id

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
        _count: {
          select: {
            questions: true
          }
        },
        createdAt: true,
        attempts: {
          where: { userId: effectiveUserId },
          select: {
            finishedAt: true
          }
        }
      },
    });
    if (!challenge)
      return errorResponse(CHALLANGE_NOT_FOUND_ERROR)
    
    return NextResponse.json({
      success: true,
      challenge,
    });
  } catch (err) {
    console.log(err);
    return errorResponse(GENERIC_ERROR)
  }
}
