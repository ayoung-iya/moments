"use server";
import db from "@/lib/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getTweets = async (page = 1, size = 5) => {
  "use cache";
  cacheTag("tweets");
  const totalPages = Math.ceil((await db.tweet.count()) / size);
  const tweets = await db.tweet.findMany({
    skip: (page - 1) * size,
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
    },
  });

  const formatTweets = tweets.map(({ user, ...tweet }) => {
    return { ...tweet, username: user.username };
  });

  return { tweets: formatTweets, currentPage: page, totalPages, hasNextPage: page < totalPages };
};
