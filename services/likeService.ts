"use server";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getIsLike = async (tweetId: number, currentUserId: number) => {
  "use cache";
  cacheTag(`tweet-${tweetId}-like`);
  const like = await db.like.findUnique({
    where: {
      id: { userId: currentUserId, tweetId },
    },
  });

  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });

  return { isLiked: !!like, likeCount };
};

export const likeTweet = async (tweetId: number) => {
  const currentUserId = await getSession();
  await db.like.create({
    data: { tweetId, userId: currentUserId.id! },
  });

  revalidateTag(`tweet-${tweetId}-like`);
  revalidateTag("tweets");
};

export const dislikeTweet = async (tweetId: number) => {
  const currentUserId = await getSession();
  await db.like.delete({
    where: {
      id: { tweetId, userId: currentUserId.id! },
    },
  });

  revalidateTag(`tweet-${tweetId}-like`);
  revalidateTag("tweets");
};
