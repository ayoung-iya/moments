import CommentCreateForm from "@/components/commentCreateForm";
import CommentList from "@/components/commentList";
import TweetDetails from "@/components/tweetDetails";
import CommentsProvider from "@/context/commentsContext";
import db from "@/lib/db";
import { getComments } from "@/services/commentService";
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
  const commentsData = await getComments(+id);

  return (
    <CommentsProvider {...commentsData}>
      <div className="rounded-md border bg-white bg-opacity-100 px-3">
        <TweetDetails {...tweet} currentUserId={myInfo!.id} {...likeData} />
        <div className="flex flex-col gap-3 border-t py-3">
          <div className="rounded-3xl bg-stone-50">
            <CommentCreateForm tweetId={+id} username={myInfo!.username} />
          </div>
          {!!commentsData.commentsCount && <CommentList />}
        </div>
      </div>
    </CommentsProvider>
  );
}
