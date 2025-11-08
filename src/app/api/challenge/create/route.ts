import { QuizObject } from "@/app/types/global";
import {
  CHALLANGE_BACKEND_CREATE_ERROR,
  GENERIC_ERROR,
} from "@/constants/errors";
import { auth } from "@/lib/auth";
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
    const {
      challenge,
      Type,
      userId,
    }: {
      challenge: {
        title: string;
        description: string;
        topic?: string;
        questions: QuizObject[];
      };
      Type: "AI" | "CUSTOM";
      userId: string;
    } = await req.json();

    if (!Type || !challenge) return errorResponse(GENERIC_ERROR);
    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const result = await prisma.$transaction(async (tx) => {
      const newChallenge = await tx.challenge.create({
        data: {
          title: challenge.title,
          description: challenge.description,
          type: Type,
          slug: challenge.title.trim().replace(/\s+/g, "-").toLowerCase(),
          createdBy: effectiveUserId,
          topic: challenge.topic,
        },
        select: {
          id: true,
          title: true,
          description: true,
          slug: true,
          topic: true,
          type: true,
          attempts: {
            where: { userId: effectiveUserId },
            select: {
              finishedAt: true,
            },
          },
        },
      });

      const questionMap = new Map<string, string>();
      const questionsData = challenge.questions.map((q) => {
        const data = {
          id: q.id,
          aiGenerated: q.aiGenerated,
          question: q.question,
          challengeId: newChallenge.id,
        };
        questionMap.set(q.question, data.id!);
        return data;
      });

      await tx.question.createMany({ data: questionsData });

      const optionsData = challenge.questions.flatMap((q) => {
        const questionEntry = questionsData.find(
          (qq) => qq.question === q.question
        );
        if (!questionEntry) {
          throw new Error(`Question not found: ${q.question}`);
        }
        const questionId = questionEntry.id;
        return q.options.map((opt) => ({
          option: opt,
          isCorrect: opt === q.answer,
          questionId,
        }));
      });

      await tx.option.createMany({ data: optionsData });

      return newChallenge;
    });
    if (!result) return errorResponse(CHALLANGE_BACKEND_CREATE_ERROR);

    return NextResponse.json({
      success: true,
      challenge: { ...result, reactionType: "Mine" },
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
