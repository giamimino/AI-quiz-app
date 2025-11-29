"use server";
import {
  ALL_FIELDS_REQUIRED_ERROR,
  ATTEMPT_DELETE_SUCCESS,
  CHALLENGE_ACCESS_ERROR,
  CHALLENGE_DELETE_SUCCESS,
  CHALLENGE_UPDATE_SUCCESS,
  GENERIC_ERROR,
  ROOM_CANT_FOUND_ERROR,
  ROOM_JOIN_SUCCESS,
  ROOM_NOT_ALLOWED_ERROR,
  ROOM_NOT_ALLOWED_JOIN_ERROR,
  ROOM_PLAYERS_LIMIT_ERROR,
  ROOM_QUESTIONS_LENGTH_ERROR,
  ROOM_REACHED_LIMIT_ERROR,
} from "@/constants/errors";
import { prisma } from "../prisma";
import { Answers } from "@/app/types/global";
import { auth } from "../auth";
import { Challenge, TopicState } from "@/app/types/store";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/configs/firebase";
import { FireStoreRooms } from "@/types/firestore";
import cuid from "cuid";

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
  userId: string | null;
}) {
  try {
    if (!challengeId)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const atempt = await prisma.attempt.findFirst({
      where: { challengeId, userId: effectiveUserId },
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
        user: { connect: { id: effectiveUserId } },
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
    const score = answers.reduce(
      (acc, ans) => (ans.isCorrect ? acc + 100 : acc + 50),
      0
    );

    const updateAttempt = await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        finishedAt,
        answers: {
          createMany: {
            data: answers,
          },
        },
        score,
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

export async function handleGetFavorites({ userId }: { userId: string }) {
  try {
    if (!userId.trim())
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const challenges = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        reactions: {
          where: { type: "STAR" },
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
      challenges: challenges?.reactions.map((r) => ({
        ...r.challenge,
        reactionType: "Favorites",
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

export async function handleReactChallenge({
  userId,
  challengeId,
  type,
}: {
  userId: string | null;
  challengeId: string;
  type: "DISLIKE" | "LIKE" | "STAR";
}) {
  try {
    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    if (!challengeId.trim() || !effectiveUserId)
      return {
        success: false,
        message: GENERIC_ERROR,
      };
    const reaction = await prisma.reaction.upsert({
      where: {
        challengeId_userId: {
          challengeId: challengeId,
          userId: effectiveUserId,
        },
      },
      update: {
        type,
      },
      create: {
        user: { connect: { id: effectiveUserId } },
        challenge: { connect: { id: challengeId } },
        type,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!reaction)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      reaction: reaction,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function countReactions({
  challengeId,
  userId,
}: {
  challengeId: string;
  userId?: string | null;
}) {
  try {
    if (!challengeId)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const session = userId?.trim() ? null : await auth();
    const effectiveUserId = userId?.trim() ?? session?.user?.id;

    const reactions = await prisma.$transaction(async (ts) => {
      const countLikes = await ts.challenge.findUnique({
        where: { id: challengeId },
        select: {
          _count: {
            select: {
              reactions: {
                where: { type: "LIKE" },
              },
            },
          },
        },
      });

      const countStars = await ts.challenge.findUnique({
        where: { id: challengeId },
        select: {
          _count: {
            select: {
              reactions: {
                where: { type: "STAR" },
              },
            },
          },
        },
      });

      const userReaction = await ts.challenge.findUnique({
        where: { id: challengeId },
        select: {
          reactions: {
            where: { userId: effectiveUserId },
            select: {
              userId: true,
              type: true,
            },
          },
        },
      });

      return {
        countLikes,
        countStars,
        userReaction: userReaction?.reactions[0],
      };
    });

    return {
      success: true,
      reactions,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function requestAttempts({ userId }: { userId: string | null }) {
  try {
    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const attempts = await prisma.user.findUnique({
      where: { id: effectiveUserId },
      select: {
        attempts: {
          select: {
            id: true,
            startedAt: true,
            finishedAt: true,
            score: true,
            challenge: {
              select: {
                id: true,
                title: true,
                description: true,
                slug: true,
                type: true,
                topic: true,
                createdBy: true,
                creator: { select: { username: true } },
              },
            },
          },
        },
      },
    });

    if (!attempts)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      attempts: attempts.attempts,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function requestDeleteAttempt({
  attemptId,
}: {
  attemptId: string;
}) {
  try {
    if (!attemptId.trim())
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    await prisma.attempt.delete({
      where: { id: attemptId },
    });

    return {
      success: true,
      message: ATTEMPT_DELETE_SUCCESS,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function searchTopic({ topic }: { topic: string }) {
  try {
    if (!topic)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const challanges = await prisma.challenge.findMany({
      where: { topic },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        type: true,
        topic: true,
        createdBy: true,
        creator: { select: { username: true } },
      },
    });

    if (!challanges)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      challanges,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function searchChallenge({
  query,
  ids,
  topics,
}: {
  query: string;
  ids: string[];
  topics: string[];
}) {
  try {
    if (!query.trim())
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const challanges = await prisma.challenge.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
        id: { notIn: ids },
        ...(topics.length !== 0 ? { topic: { in: topics } } : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        type: true,
        topic: true,
        createdBy: true,
        creator: { select: { username: true } },
      },
      take: 3,
    });

    if (!challanges)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      challanges,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function RequestTopics() {
  try {
    const popularTopics = await prisma.$queryRaw`
      SELECT c."topic", COUNT(r.id) AS "reactionCount", MIN(c.id) AS "challengeId"
      FROM "Challenge" c
      LEFT JOIN "Reaction" r ON c.id = r."challengeId"
      WHERE c."topic" IS NOT NULL
      GROUP BY c."topic"
      ORDER BY "reactionCount" DESC
      LIMIT 20;
    `;

    return {
      success: true,
      popularTopics: popularTopics as TopicState[],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function requestRandomChallenge({
  ids,
  take,
}: {
  ids: string[];
  take: number;
}) {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { id: { notIn: ids } },
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        type: true,
        slug: true,
        creator: {
          select: {
            name: true,
            username: true,
            id: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
        createdAt: true,
      },
      take,
    });

    const reactions = await prisma.$transaction(async (tx) => {
      const countLikes = await tx.challenge.findMany({
        where: { id: { in: challenges.map((c) => c.id) } },
        select: {
          id: true,
          _count: {
            select: {
              reactions: { where: { type: "LIKE" } },
            },
          },
        },
      });

      const countStars = await tx.challenge.findMany({
        where: { id: { in: challenges.map((c) => c.id) } },
        select: {
          id: true,
          _count: {
            select: {
              reactions: { where: { type: "STAR" } },
            },
          },
        },
      });

      return { countLikes, countStars };
    });

    if (!challenges)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      challenges: challenges.map((c) => {
        let likes = 0;
        let favorites = 0;
        reactions.countLikes.map((cl) =>
          cl.id === c.id ? (likes = cl._count.reactions) : cl
        );
        reactions.countStars.map((cl) =>
          cl.id === c.id ? (favorites = cl._count.reactions) : cl
        );

        return { ...c, likes, favorites };
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function requestChallengeForEdit({
  slug,
  id,
  userId,
}: {
  slug: string;
  id?: string;
  userId?: string;
}) {
  try {
    if (!slug.trim())
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const challenge = await prisma.challenge.findUnique({
      where: { ...(id ? { id } : { slug }), createdBy: effectiveUserId },
      select: {
        slug: true,
        id: true,
        type: true,
        title: true,
        topic: true,
        description: true,
      },
    });

    if (!challenge)
      return {
        success: false,
        message: CHALLENGE_ACCESS_ERROR,
      };

    return {
      success: true,
      challenge,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function updateChallenge({
  challenge,
  challengeId,
}: {
  challenge: {
    slug: string;
    title: string;
    description: string;
    topic: string;
  };
  challengeId: string;
}) {
  try {
    const updateChallenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: challenge,
      select: {
        id: true,
      },
    });

    if (!updateChallenge)
      return {
        success: false,
        message: `${GENERIC_ERROR} challenge can't be updated.`,
      };

    return {
      success: true,
      message: CHALLENGE_UPDATE_SUCCESS,
      challengeId: updateChallenge.id,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function countScore({ userId }: { userId?: string | null }) {
  try {
    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const totalScore = await prisma.attempt.aggregate({
      _sum: {
        score: true,
      },
      where: {
        userId: effectiveUserId,
      },
    });

    if (!totalScore)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      totalScore,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function requestUserForEdit({
  userId,
}: {
  userId?: string | null;
}) {
  try {
    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: effectiveUserId },
      select: {
        birthday: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
        image: true,
      },
    });

    if (!user)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function requestAttemptsActivity({
  userId,
}: {
  userId?: string | null;
}) {
  try {
    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;

    const attempts = await prisma.attempt.findMany({
      where: { userId: effectiveUserId },
      select: {
        startedAt: true,
        score: true,
      },
    });

    if (!attempts)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      attempts,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function searchUsers({
  username,
  ids,
}: {
  username: string;
  ids: string[];
}) {
  try {
    const users = await prisma.user.findMany({
      where: { username: { contains: username }, id: { notIn: ids } },
      select: {
        id: true,
        image: true,
        username: true,
        name: true,
        createdAt: true,
      },
      take: 10,
    });

    if (users.length === 0)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: GENERIC_ERROR,
    };
  }
}

export async function CreateRoom({
  formData,
  isPublic,
  user,
}: {
  formData: FormData;
  isPublic: boolean;
  user?: {
    id: string;
    name: string;
    username: string;
  };
}) {
  try {
    const title = formData.get("title") as string;
    const topic = formData.get("topic") as string;
    const players_limit = Number(formData.get("players_limit") as string); // number
    const questions_length = Number(formData.get("questions_length") as string); // number

    if (!title.trim() || !topic.trim() || !players_limit || !questions_length)
      return { success: false, message: ALL_FIELDS_REQUIRED_ERROR };

    if (players_limit % 2 !== 0 || players_limit > 6 || players_limit < 2)
      return {
        success: false,
        message: ROOM_PLAYERS_LIMIT_ERROR,
      };

    if (questions_length > 25 || questions_length < 1)
      return {
        success: false,
        message: ROOM_QUESTIONS_LENGTH_ERROR,
      };

    const session = user ? null : await auth();
    const effectiveUserId = user?.id ?? session?.user?.id;
    const roomsRef = collection(db, "rooms");
    const roomId = cuid();
    const now = new Date();
    addDoc(roomsRef, {
      title,
      topic,
      players_limit,
      questions_length,
      public: isPublic,
      createdBy: effectiveUserId,
      createdAt: now,
      players: [user],
      deadline: (now.getTime() + 360).toString(),
      id: roomId,
    } as FireStoreRooms);

    return {
      success: true,
      roomId,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: GENERIC_ERROR,
      developerMessage: error,
    };
  }
}

export async function deleteRoom({
  userId,
  roomId,
}: {
  userId?: string;
  roomId: string;
}) {
  try {
    if (!roomId)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const session = userId ? null : await auth();
    const effectiveUserId = userId ?? session?.user?.id;
    const roomRef = doc(db, "rooms", roomId);
    const snap = await getDoc(roomRef);

    if (!snap.exists())
      return {
        success: false,
        message: ROOM_CANT_FOUND_ERROR,
      };

    const data = snap.data();

    if (data?.createdBy !== effectiveUserId)
      return {
        success: false,
        message: ROOM_NOT_ALLOWED_ERROR,
      };

    await deleteDoc(roomRef);

    return {
      success: true,
      message: "Room deleted successfully.",
      roomId,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: GENERIC_ERROR,
      developerMessage: error,
    };
  }
}

export async function joinRoom({
  user,
  roomId,
}: {
  user?: { id: string; name: string; username: string };
  roomId: string;
}) {
  try {
    if (!roomId)
      return {
        success: false,
        message: GENERIC_ERROR,
      };

    const roomRef = doc(db, "rooms", roomId);
    const snap = await getDoc(roomRef);

    if (!snap.exists())
      return {
        success: false,
        message: ROOM_CANT_FOUND_ERROR,
      };

    const data = snap.data() as FireStoreRooms;

    if (data.createdBy === user?.id)
      return {
        success: false,
        message: ROOM_NOT_ALLOWED_JOIN_ERROR,
      };

    if (Number(data.players.length) === Number(data.players_limit))
      return {
        success: false,
        message: ROOM_REACHED_LIMIT_ERROR,
      };

    const newData = {
      ...data,
      players: [...data.players, user],
    };

    await setDoc(roomRef, newData);

    return {
      success: true,
      message: ROOM_JOIN_SUCCESS,
      roomId
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: GENERIC_ERROR,
      developerMessage: error,
    };
  }
}
