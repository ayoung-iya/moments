"use server";
import db from "@/lib/db";

export const getTweets = async (page = 1, size = 3) => {
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
