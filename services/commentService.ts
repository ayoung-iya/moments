"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { PromiseReturnType } from "@prisma/client/extension";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/react-native.js";
import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getComments = async (tweetId: number) => {
  "use cache";
  cacheTag("comments");
  const comments = await db.comment.findMany({
    where: { tweetId },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const commentsCount = await db.comment.count({
    where: { tweetId },
  });

  const formatComments = comments.map(({ user, ...comment }) => ({
    ...comment,
    username: user.username,
  }));

  return { comments: formatComments, commentsCount };
};

export const postComment = async (tweetId: number, newComment: string) => {
  const session = await getSession();

  try {
    await db.comment.create({
      data: {
        payload: newComment,
        userId: session.id!,
        tweetId,
      },
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: {
        message: "댓글 전송에 실패했습니다.",
      },
    };
  } finally {
    revalidateTag("tweets");
    revalidateTag("comments");
  }
};

export const putComment = async (id: number, comment: string) => {
  try {
    await db.comment.update({
      where: { id },
      data: { payload: comment },
    });

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: {
        message: "댓글 수정을 실패했습니다.",
      },
    };
  } finally {
    revalidateTag("comments");
  }
};

export const deleteComment = async (id: number) => {
  try {
    await db.comment.delete({
      where: { id },
    });
  } catch (e) {
    if ((e as PrismaClientKnownRequestError).code === "P2025")
      return {
        error: {
          message: "존재하지 않는 id입니다.",
        },
      };
  } finally {
    revalidateTag("tweets");
    revalidateTag("comments");
  }
};

export type Comments = PromiseReturnType<typeof getComments>;
