import { GENERIC_ERROR } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

export async function POST(req: Request) {
  try {
    const { attemptId }: { attemptId: string } = await req.json();
    if (!attemptId) return errorResponse(GENERIC_ERROR);
    const answers = await prisma.attempt.findUnique({
      where: { id: attemptId },
      select: {
        finishedAt: true,
        startedAt: true,
        answers: {
          select: {
            id: true,
            isCorrect: true,
            option: {
              select: {
                id: true,
                option: true,
              },
            },
            question: {
              select: {
                id: true,
                question: true,
              },
            },
          },
        },
      },
    });

    if(!answers)
      return errorResponse(GENERIC_ERROR)

    return NextResponse.json({
      success: true,
      attempt: { startedAt: answers.startedAt, finishedAt: answers.finishedAt },
      answers: answers.answers
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
