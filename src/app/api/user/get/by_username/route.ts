import { GENERIC_ERROR, USER_NOT_FOUND_ERROR } from "@/constants/errors";
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
    const { username, userId }: { username: string; userId?: string | null } =
      await req.json();
    if (!username) return errorResponse(GENERIC_ERROR);

    const user = await prisma.user.findUnique({
      where: { ...(userId ? { id: userId } : { username }) },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthday: true,
        username: true,
        challenges: {
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            topic: true,
            type: true
          }
        }
      },
    });

    if (!user) return errorResponse(USER_NOT_FOUND_ERROR);

    const reactions = await prisma.reaction.findMany({
      where: { userId: user?.id },
      select: {
        type: true,
      },
    });

    const counts = reactions.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      { LIKE: 0, DISLIKE: 0, STAR: 0 }
    );

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        reactions: {
          likes: counts.LIKE,
          favorites: counts.STAR,
          dislikes: counts.DISLIKE,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
