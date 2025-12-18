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
      take: 10,
      cursor: { id: oldestMessageId },
      orderBy: { createdAt: "desc" },
    });

    if(!messages || messages.length === 0) return errorResponse("No messages left.")

    const reversedMessages = messages.reverse();

    return NextResponse.json({
      success: true,
      messages: reversedMessages,
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
