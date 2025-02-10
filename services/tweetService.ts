"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export type Tweet = {
  username: string;
  tweet: string;
  photo: string | null;
  photoWidth: number | null;
  photoHeight: number | null;
  id: number;
  created_at: Date;
  updated_at: Date;
  userId: number;
};

type UpdateTweetInfo = Pick<Tweet, "id" | "tweet"> & Partial<Pick<Tweet, "photo" | "photoWidth" | "photoHeight">>;

export const getTweet = async (id: number) => {
  "use cache";
  cacheTag(`tweet-${id}`);
  const tweet = await db.tweet.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!tweet) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, ...rest } = tweet;

  const formatTweet = {
    ...rest,
    username: tweet?.user.username,
  };

  return formatTweet;
};

export const updateTweet = async ({ id, tweet, photo, photoWidth, photoHeight }: UpdateTweetInfo) => {
  const session = await getSession();

  await db.tweet.update({
    where: { id, userId: session.id! },
    data: { tweet, photo, photoWidth, photoHeight },
  });
};

export const deleteTweet = async (id: number) => {
  try {
    await db.tweet.delete({
      where: { id },
    });

    revalidateTag("tweets");
  } catch (e) {
    if ((e as PrismaClientKnownRequestError).code === "P2025")
      return {
        error: {
          message: "존재하지 않는 id입니다.",
        },
      };
  }
};
