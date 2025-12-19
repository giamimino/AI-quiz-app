import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}
const LIMIT = 10;

export async function POST(req: Request) {
  try {
    const {
      conversationId,
      oldestMessageId,
    }: {
      conversationId: string;
      oldestMessageId: string;
    } = await req.json();

    const messages = await prisma.message.findMany({
      where: { converstationId: conversationId },
      select: {
        id: true,
        text: true,
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      skip: 1,
      take: LIMIT + 1,
      cursor: { id: oldestMessageId },
      orderBy: { createdAt: "desc" },
    });

    const hasMore = messages.length > LIMIT;

    const slicedMessages = hasMore ? messages.slice(0, LIMIT) : messages;

    const reversedMessages = slicedMessages.reverse();

    return NextResponse.json({
      success: true,
      messages: reversedMessages,
      hasMore
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
