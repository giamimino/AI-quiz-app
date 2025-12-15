import { FRIEND_REQUEST_UNIQUE_ERROR, GENERIC_ERROR } from "@/constants/errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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
      requesterId,
      receiverId,
    }: { requesterId?: string | null; receiverId: string } = await req.json();

    const session = requesterId ? null : await auth();
    const effectiveRequesterId = requesterId ?? session?.user?.id;

    const friendRequest = await prisma.friendRequest.create({
      data: {
        receiverId,
        requesterId: effectiveRequesterId as string,
      },
      select: {
        id: true,
      },
    });

    if (!friendRequest) return errorResponse(GENERIC_ERROR);

    return NextResponse.json({
      success: true,
      friendRequestId: friendRequest.id,
      session
    });
  } catch (err) {
    console.log(err);
    if(err instanceof Prisma.PrismaClientKnownRequestError) {
      if(err.code === "P2002") {
        return errorResponse(FRIEND_REQUEST_UNIQUE_ERROR)
      }
    }
    return errorResponse(GENERIC_ERROR);
  }
}
