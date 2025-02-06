import TweetDetails from "@/components/tweetDetails";
import db from "@/lib/db";
import { getIsLike } from "@/services/likeService";
import { getMe } from "@/services/userService";
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
  const myInfo = await getMe();
  if (!Number.isInteger(+id)) {
    return notFound();
  }
  const tweet = await fetchTweet(+id);
  const likeData = await getIsLike(+id, myInfo!.id);

  return <TweetDetails {...tweet} currentUserId={myInfo!.id} {...likeData} />;
}
