"use server";
import db from "@/lib/db";
import { PromiseReturnType } from "@prisma/client/extension";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

interface GetTweetsProps {
  page?: number;
  size?: number;
  currentUserId: number;
}

export const getTweets = async ({ page = 0, size = 5, currentUserId }: GetTweetsProps) => {
  "use cache";
  cacheTag("tweets");

  const totalPages = Math.ceil((await db.tweet.count()) / size);
  const tweets = await db.tweet.findMany({
    skip: page * size,
    take: size,
    orderBy: {
      created_at: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      likes: {
        where: { userId: currentUserId },
        select: { userId: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  const formatTweets = tweets.map(({ user, likes, _count, ...tweet }) => {
    return {
      ...tweet,
      username: user.username,
      isLiked: !!likes.length,
      likeCount: _count.likes,
      commentsCount: _count.comments,
    };
  });

  return { tweets: formatTweets, currentPage: page, totalPages, hasNextPage: page < totalPages };
};

export type Tweets = PromiseReturnType<typeof getTweets>;
