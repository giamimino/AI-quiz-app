import { GENERIC_ERROR, USER_NOT_FOUND_ERROR } from "@/constants/errors";
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
    const { username, userId, mainUserId }: { username: string; userId?: string | null, mainUserId?: string | null } =
      await req.json();
    if (!username) return errorResponse(GENERIC_ERROR);

    const session = mainUserId ? null : await auth()
    const effectiveUserId = mainUserId ?? session?.user?.id

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
            type: true,
          }
        },
        friendRequestsReceived: {
          where: { requesterId: effectiveUserId },
          select: {
            id: true,
            requester: {
              select: {
                id: true
              }
            }
          }
        }
      },
    });

    if (!user) return errorResponse(USER_NOT_FOUND_ERROR);

    const reactions = await prisma.$transaction(async (ts) => {
      const countLikes = await ts.challenge.count({
        where: {
          createdBy: user.id,
          reactions: {
            some: { type: 'LIKE' }
          }
        }
      })
  
      const countStars = await ts.challenge.count({
        where: {
          createdBy: user.id,
          reactions: {
            some: { type: 'STAR' }
          }
        }
      })


      return { countLikes, countStars }
    })



    return NextResponse.json({
      success: true,
      user: {
        ...user,
        reactions: {
          likes: reactions.countLikes ?? 0,
          favorites: reactions.countStars ?? 0
        },
      },
    });
  } catch (err) {
    console.log(err);
    return errorResponse("Something went wrong.");
  }
}
