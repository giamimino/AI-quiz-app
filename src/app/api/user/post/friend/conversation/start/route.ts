import { CONVERSATION_START_ERROR, GENERIC_ERROR } from "@/constants/errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cuid from "cuid";
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

    const startConversation = await prisma.$transaction(async (tx) => {
      const conversationId = cuid();

      await tx.conversation.create({
        data: {
          id: conversationId,
        },
      });

      const formatedParticantsData = [
        { userId: effectiveUserId as string, conversationId },
        { userId: friendId, conversationId },
      ];

      await tx.conversationParticipant.createMany({
        data: formatedParticantsData,
        skipDuplicates: true,
      });

      const conversation = tx.conversation.findUnique({
        where: { id: conversationId },
        select: {
          id: true,
          createdAt: true,
          lastMessage: true,
          lastMessageId: true,
          participants: {
            select: {
              conversationId: true,
              id: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          updatedAt: true,
        },
      });

      return conversation;
    });

    if (!startConversation) return errorResponse(CONVERSATION_START_ERROR);

    return NextResponse.json({
      success: true,
      conversationId: startConversation.id,
      conversation: startConversation,
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
