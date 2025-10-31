import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message,
  });
}

export async function GET() {
  try {
    const session = await auth();
    const username = (await prisma.user.findUnique({
      where: { id: session?.user?.id },
      select: {
        username: true,
      },
    }))?.username
    return NextResponse.json({
      success: true,
      user: {
        name: session?.user?.name,
        username,
        ...session?.user,
      },
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
