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
    const { userId }: { userId?: string } = await req.json();
    const session = userId ? null : await auth()
    const effectiveUserId = userId ?? session?.user?.id

    const particants = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: effectiveUserId }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        lastMessage: true
      }
    })

    return NextResponse.json({
      success: true,
      particants
    })
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
