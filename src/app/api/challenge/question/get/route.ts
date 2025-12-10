import { GENERIC_ERROR, QUESTION_GET_ERROR } from "@/constants/errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

export async function POST(req: Request) {
  try {
    const { challengeId, userId }: { challengeId: string; userId: string } =
      await req.json();

    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    if (!challengeId) return errorResponse(GENERIC_ERROR);

    const redisQuestionIdsCache = `questions:${challengeId}/user:${effectiveUserId}`;
    const questionIds = ((await redis.get(
      redisQuestionIdsCache
    )) as string[]) ?? [""];

    const question = await prisma.question.findFirst({
      where: { challengeId, id: { notIn: questionIds } },
      select: {
        id: true,
        question: true,
        aiGenerated: true,
        options: {
          select: {
            id: true,
            option: true,
            isCorrect: true,
          },
        },
      },
    });

    if (!question) return errorResponse(QUESTION_GET_ERROR);
    await redis.set(redisQuestionIdsCache, [...questionIds, question.id], {
      ex: 30 * 60,
    });

    return NextResponse.json({
      success: true,
      question,
      session,
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
