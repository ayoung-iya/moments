"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { tweetSchema } from "@/services/schema/tweet";
import { revalidateTag } from "next/cache";

export const handleForm = async (formData: FormData, { id, userId }: { id: number; userId: number }) => {
  const data = {
    tweet: formData.get("tweet") as string,
    photo: formData.get("photo") as string,
    photoWidth: formData.get("photoWidth") ? +(formData.get("photoWidth") as string) : null,
    photoHeight: formData.get("photoHeight") ? +(formData.get("photoHeight") as string) : null,
  };

  const result = tweetSchema.safeParse(data);

  if (!result.success) {
    return {
      success: result.success,
      errors: { ...result.error.flatten().fieldErrors },
      data,
    };
  }

  const session = await getSession();

  if (!session.id) {
    return {
      success: false,
      errors: {
        session: ["로그인이 필요합니다."],
      },
      data,
    };
  }

  if (session.id !== userId) {
    return {
      success: false,
      errors: {
        permission: ["수정 권한이 없습니다."],
      },
      data,
    };
  }

  await db.tweet.update({
    where: { id },
    data: {
      tweet: result.data.tweet,
      photo: result.data.photo || null,
      photoWidth: result.data.photoWidth || null,
      photoHeight: result.data.photoHeight || null,
    },
  });

  revalidateTag(`tweet-${id}`);
  revalidateTag("tweets");

  return {
    success: result.success,
    errors: null,
    data: result.data,
  };
};
