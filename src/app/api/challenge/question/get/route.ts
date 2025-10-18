import { GENERIC_ERROR, QUESTION_GET_ERROR } from "@/constants/errors";
import { prisma } from "@/lib/prisma";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}

export async function POST(req: Request) {
  try {
    const { challengeId }: {challengeId: string} = await req.json()
    if(!challengeId) return errorResponse(GENERIC_ERROR)
    const RedisIdsCacheKey = `questions:${challengeId}`
    const ids = await redis.get(RedisIdsCacheKey) as string[] ?? []
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

    if(!question ) return errorResponse(QUESTION_GET_ERROR)
    await redis.set(RedisIdsCacheKey, [...ids, question.id], { ex: 60 * 60 * 12 })
    return NextResponse.json({
      success: true,
      question
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.")
  }
}