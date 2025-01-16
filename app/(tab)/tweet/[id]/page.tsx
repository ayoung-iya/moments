import TweetItem from "@/components/tweetDetails";
import db from "@/lib/db";
import { notFound } from "next/navigation";

const fetchTweet = async (id: number) => {
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
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, ...rest } = tweet;

  const formatTweet = {
    ...rest,
    username: tweet?.user.username,
  };

  return formatTweet;
};

export default async function Tweet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!Number.isInteger(+id)) {
    return notFound();
  }
  const tweet = await fetchTweet(+id);

  return <TweetItem {...tweet} />;
}
