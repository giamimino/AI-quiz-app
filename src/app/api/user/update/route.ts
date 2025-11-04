import { GENERIC_ERROR, USER_UPDATE_SUCCESS } from "@/constants/errors";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomString } from "@/utils/random-string";
import validateWord from "@/utils/ValidateWord";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

export async function POST(req: Request) {
  const {
    name,
    username,
    birthday,
    userId,
  }: {
    name: string;
    username: string;
    birthday: Date;
    userId?: string | null;
  } = await req.json();
  try {
    const isValidate = validateWord(username);

    if (!isValidate.ok)
      return NextResponse.json(
        {
          success: false,
          message:
            "Username contains illegal characters. Only letters, numbers, spaces, underscores (_), and hyphens (-) are allowed.",
          suggested: { username: isValidate.value },
        },
        { status: 400 }
      );
    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const user = await prisma.user.update({
      where: { id: effectiveUserId },
      data: {
        name,
        username,
        birthday,
      },
      select: {
        id: true,
      },
    });

    if (!user) return errorResponse(`${GENERIC_ERROR} user can't be updated`);

    return NextResponse.json({ success: true, user, message: USER_UPDATE_SUCCESS });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          {
            message: "Username already exists.",
            suggested: { username: `${name}_${randomString(3)}` },
          },
          { status: 400 }
        );
      }
    }
    console.error(err);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
