"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/react-native.js";
import { revalidateTag } from "next/cache";

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

    revalidateTag("comments");
  } catch (e) {
    if ((e as PrismaClientKnownRequestError).code === "P2025")
      return {
        error: {
          message: "존재하지 않는 id입니다.",
        },
      };
  }
};
