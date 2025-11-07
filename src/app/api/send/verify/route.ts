import { GENERIC_ERROR } from "@/constants/errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyEmailToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

export async function POST(req: Request) {
  try {
    const { token, userId }: { token: string; userId?: string | null } =
      await req.json();
    if (!token) 
      return errorResponse(GENERIC_ERROR);

    const paylod = verifyEmailToken(token);
    const date = new Date();

    if ('error' in paylod)
      return errorResponse("Verification link not found or expired.");

    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const userUpdate = await prisma.user.update({
      where: { id: effectiveUserId },
      data: {
        emailVerified: date,
      },
      select: {
        id: true,
      },
    });

    if (!userUpdate)
      return errorResponse("Verification link not found or expired.");

    return NextResponse.json({
      success: true,
      date,
      userId: userUpdate.id,
      paylod
    });
  } catch (err) {
    console.log(err);
    return errorResponse(GENERIC_ERROR);
  }
}
