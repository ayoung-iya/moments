"use server";
import db from "@/lib/db";
import { PromiseReturnType } from "@prisma/client/extension";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

interface GetTweetsProps {
  page?: number;
  size?: number;
}

export const getTweets = async ({ page = 0, size = 5 }: GetTweetsProps) => {
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
    },
  });

  const formatTweets = tweets.map(({ user, ...tweet }) => {
    return {
      ...tweet,
      username: user.username,
    };
  });

  return { tweets: formatTweets, currentPage: page, totalPages, hasNextPage: page < totalPages };
};

export type Tweets = PromiseReturnType<typeof getTweets>;
