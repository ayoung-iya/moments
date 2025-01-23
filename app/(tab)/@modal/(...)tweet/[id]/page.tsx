import CommentCreateForm from "@/components/commentCreateForm";
import TweetDetails from "@/components/tweetDetails";
import FramedInterceptModal from "@/components/framedInterceptModal";
import db from "@/lib/db";
import CommentList from "@/components/commentList";
import { PromiseReturnType } from "@prisma/client/extension";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import CommentsProvider from "@/context/commentsContext";
import { getMe } from "@/services/userService";

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

const getComments = async (tweetId: number) => {
  "use cache";
  cacheTag("comments");
  const comments = await db.comment.findMany({
    where: { tweetId },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formatComments = comments.map(({ user, ...comment }) => ({
    ...comment,
    username: user.username,
  }));

  return formatComments;
};

export type Comments = PromiseReturnType<typeof getComments>;

export default async function ModalTweet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const myInfo = await getMe();
  const comments = await getComments(+id);

  if (!Number.isInteger(+id)) {
    return null;
  }

  const tweet = await fetchTweet(+id);
  if (!tweet) {
    return null;
  }

  return (
    <CommentsProvider comments={comments}>
      <FramedInterceptModal>
        <div className="flex h-full flex-col">
          <div className="flex h-14 shrink-0 items-center justify-center border-b">
            <span className="text-lg font-bold">{tweet.username}님의 게시물</span>
          </div>
          <div className="scrollbar-custom grow overflow-y-auto p-3">
            <TweetDetails {...tweet} />
            <CommentList />
          </div>
          <div className="shadow-top">
            <CommentCreateForm tweetId={+id} username={myInfo!.username} />
          </div>
        </div>
      </FramedInterceptModal>
    </CommentsProvider>
  );
}
