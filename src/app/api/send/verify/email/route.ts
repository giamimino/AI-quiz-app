import { GENERIC_ERROR } from "@/constants/errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unCodeToken, verifyEmailToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

export async function POST(req: Request) {
  try {
    const { token, userId }: { token: string, userId: string } =
      await req.json();
    if (!token) 
      return errorResponse(GENERIC_ERROR);

    const session = userId ? null : await auth()
    const effectiveUserId = userId ?? session?.user?.id
    const date = new Date()

    const paylod = verifyEmailToken(token);
    
    if ('error' in paylod)
      return errorResponse("Verification link not found or expired.");
    
    const decoded = unCodeToken(token) as {
      email: string;
      iat: number;
      exp: number;
    }

    const updateUser = await prisma.user.update({
      where: { id: effectiveUserId },
      data: {
        email: decoded.email,
        emailVerified: date
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      }
    })

    if(!updateUser)
      return errorResponse(GENERIC_ERROR)

    return NextResponse.json({
      success: true,
      paylod,
      user: updateUser
    });
  } catch (err) {
    console.log(err);
    return errorResponse(GENERIC_ERROR);
  }
}