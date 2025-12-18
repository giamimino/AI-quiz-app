import { CONVERSATION_START_ERROR, GENERIC_ERROR } from "@/constants/errors";
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
    const { userId, friendId }: { userId?: string; friendId: string } =
      await req.json();

    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;
    const now = new Date();

    const startConversation = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          createdAt: now,
        },
        select: {
          id: true,
        },
      });

      const formatedParticantsData = [
        { userId: effectiveUserId as string, conversationId: conversation.id },
        { userId: friendId, conversationId: conversation.id },
      ];

      await tx.conversationParticipant.createMany({
        data: formatedParticantsData,
        skipDuplicates: true,
      });

      return conversation.id;
    });

    if (!startConversation) return errorResponse(CONVERSATION_START_ERROR);

    return NextResponse.json({
      success: true,
      conversationId: startConversation
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
