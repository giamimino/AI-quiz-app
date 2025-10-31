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
    const { challengeId }: 
    { challengeId: string } = await req.json();

    if(!challengeId) return errorResponse(GENERIC_ERROR)

    const count = await prisma.question.count({
      where: { challengeId }
    })

    if(!count) return errorResponse(GENERIC_ERROR)

    return NextResponse.json({
      success: true,
      count
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
