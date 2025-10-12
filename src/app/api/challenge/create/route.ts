import { QuizObject } from "@/app/types/global";
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
    //QuestionCreateNestedManyWithoutChallengeInput
    const {
      challenge,
      Type,
      userId
    }: {
      challenge: {
        title: string;
        description: string;
        questions: QuizObject[];
      };
      Type: "AI" | "CUSTOM";
      userId: string
    } = await req.json();

    const prismaData = challenge.questions.map(q => {
      text: q.question as string,
      aiGenerated: q.aiGenerated as boolean,
      options: {
        create: q.options.map(option => {
          text: option as string,
          isCorrect: (q.answer === option) as boolean
        })
      }
    })

    const primsa = await prisma.challenge.create({
      data: {
        title: challenge.title,
        description: challenge.description,
        type: Type,
        questions: {
          create: prismaData
        },
        creator: { connect: { id: userId } }
      },
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
