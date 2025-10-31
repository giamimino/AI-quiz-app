import { GENERIC_ERROR, QUESTION_GET_ERROR } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}
const ids:string[] = []

export async function POST(req: Request) {
  try {
    const { challengeId }: {challengeId: string} = await req.json()
    if(!challengeId) return errorResponse(GENERIC_ERROR)

    const question = await prisma.question.findFirst({
      where: { challengeId, id: { notIn: ids } },
      select: {
        id: true,
        question: true,
        aiGenerated: true,
        options: {
          select: {
            id: true,
            option: true,
            isCorrect: true
          }
        }
      }
    })

    if(!question) return errorResponse(QUESTION_GET_ERROR)
    ids.push(question.id)
    return NextResponse.json({
      success: true,
      question
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.")
  }
}