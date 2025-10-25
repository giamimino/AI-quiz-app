"use server";
import {
  ATEMPT_ALREADY_EXIST_WARNING,
  CHALLENGE_DELETE_SUCCESS,
  GENERIC_ERROR,
} from "@/constants/errors";
import { prisma } from "../prisma";
import { Answers } from "@/app/types/global";
import { auth } from "../auth";
import { Session, User } from "next-auth";
import { Challenge } from "@/app/types/store";

export async function challangeDelete(id: string) {
  try {
    if (!id) return { success: false, message: GENERIC_ERROR };
    await prisma.challenge.delete({
      where: { id },
    });

    return {
      success: true,
      message: CHALLENGE_DELETE_SUCCESS,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function challengeStart({
  challengeId,
  userId,
}: {
  challengeId: string;
  userId: string;
}) {
  try {
    if (!challengeId)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const atempt = await prisma.attempt.findFirst({
      where: { challengeId },
      select: {
        id: true,
        finishedAt: true,
      },
    });

    if (atempt)
      return {
        success: true,
        finished: atempt.finishedAt ? true : false,
        atempt: atempt,
      };

    const newAtempt = await prisma.attempt.create({
      data: {
        user: { connect: { id: userId } },
        challenge: { connect: { id: challengeId } },
      },
      select: {
        id: true,
      },
    });

    if (!newAtempt)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      atempt: newAtempt,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function atemptSendAnswer({
  answer,
  attemptId,
}: {
  answer: Answers;
  attemptId: string;
}) {
  try {
    if (!answer || !attemptId)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const createAnswer = await prisma.answer.create({
      data: {
        ...answer,
        attemptId,
      },
      select: {
        id: true,
      },
    });

    if (!createAnswer)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      answerId: createAnswer.id,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function sendResult({
  answers,
  attemptId,
}: {
  answers: Answers[];
  attemptId: string;
}) {
  try {
    if (!answers.length || !attemptId.trim())
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const finishedAt = new Date(Date.now());

    const updateAttempt = await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        finishedAt,
        answers: {
          createMany: {
            data: answers,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!updateAttempt)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      attemptId: updateAttempt.id,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function handleGetChallenges({ userId }: { userId: string }) {
  try {
    if (!userId.trim())
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const challenges = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        challenges: {
          select: {
            id: true,
            title: true,
            description: true,
            slug: true,
            topic: true,
            type: true,
            attempts: {
              where: { userId },
              select: {
                finishedAt: true,
              },
            },
          },
        },
      },
    });

    if (!challenges)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      challenges: challenges.challenges.map((c) => ({
        ...c,
        reactionType: "Mine",
      })) as Challenge[],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function handleGetLiked({ userId }: { userId: string }) {
  try {
    if (!userId.trim())
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const challanges = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        reactions: {
          where: { type: "LIKE" },
          select: {
            challenge: {
              select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                topic: true,
                type: true,
                attempts: {
                  where: { userId },
                  select: {
                    finishedAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      challanges: challanges?.reactions.map((r) => ({
        ...r.challenge,
        reactionType: "Liked",
      })),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function handleReactChallenge({ userId, challengeId, type }: { userId: string | null, challengeId: string, type: "DISLIKE" | "LIKE" | "STAR" }) {
  try {
    const session = userId ? null : await auth()
    const effectiveUserId = userId ?? session?.user?.id
    
    if(!challengeId.trim() || !effectiveUserId)
      return {
        success: false,
        message: GENERIC_ERROR
      }
    const reaction = await prisma.reaction.upsert({
      where: {
        challengeId_userId: {
          challengeId: challengeId,
          userId: effectiveUserId,
        }
      },
      update: {
        type
      },
      create: {
        user: { connect: { id: effectiveUserId } },
        challenge: { connect: { id: challengeId } },
        type
      },
      select: {
        id: true,
        type: true
      }
    })

    if(!reaction) 
      return {
        success: false,
        message: GENERIC_ERROR
      }

    return {
      success: true,
      reaction: reaction
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR
    }
  }
}