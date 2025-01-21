"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
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

    // revalidate
    revalidateTag("comments");

    return { success: true };
  } catch {
    return {
      success: false,
      error: {
        message: "댓글 전송에 실패했습니다.",
      },
    };
  }
};
