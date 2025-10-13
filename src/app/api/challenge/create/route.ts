import { QuizObject } from "@/app/types/global";
import { CHALLANGE_BACKEND_CREATE_ERROR, GENERIC_ERROR } from "@/constants/errors";
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
        questions: QuizObject[];
      };
      Type: "AI" | "CUSTOM";
      userId: string;
    } = await req.json();

    if(!userId || !Type || !challenge) return errorResponse(GENERIC_ERROR)
    const result = await prisma.$transaction(async (tx) => {
      const newChallenge = await tx.challenge.create({
        data: {
          title: challenge.title,
          description: challenge.description,
          type: Type,
          slug: challenge.title.trim().replace(/\s+/g, "-").toLowerCase(),
          createdBy: userId
        },
        select: {
          id: true,
        },
      });

      const questionsData = challenge.questions.map(
        ({ options, answer, ...rest }) => ({
          ...rest,
          challengeId: newChallenge.id,
        })
      );

      await tx.question.createMany({ data: questionsData });

      const optionsData = challenge.questions.flatMap((q) => {
        const questionId =
          questionsData.find((qq) => qq.question === q.question)?.id!;
        return q.options.map((opt) => ({
          option: opt,
          isCorrect: opt === q.answer,
          questionId,
        }));
      });

      await tx.option.createMany({ data: optionsData })

      return newChallenge
    });
    if(!result) return errorResponse(CHALLANGE_BACKEND_CREATE_ERROR)

    return NextResponse.json({
      success: true,
      challengeId: result.id
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
