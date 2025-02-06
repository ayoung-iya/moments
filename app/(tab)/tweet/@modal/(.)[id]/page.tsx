import CommentCreateForm from "@/components/commentCreateForm";
import TweetDetails from "@/components/tweetDetails";
import FramedInterceptModal from "@/components/framedInterceptModal";
import db from "@/lib/db";
import CommentList from "@/components/commentList";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import CommentsProvider from "@/context/commentsContext";
import { getMe } from "@/services/userService";
import { getIsLike } from "@/services/likeService";
import { getComments } from "@/services/commentService";

const fetchTweet = async (id: number) => {
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



export default async function ModalTweet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const myInfo = await getMe();

  if (!Number.isInteger(+id)) {
    return null;
  }

  const tweet = await fetchTweet(+id);
  const likeData = await getIsLike(+id, myInfo!.id);
  const commentsData = await getComments(+id);

  if (!tweet) {
    return null;
  }

  return (
    <CommentsProvider {...commentsData}>
      <FramedInterceptModal>
        <div className="flex h-full flex-col">
          <div className="flex h-14 shrink-0 items-center justify-center border-b">
            <span className="text-lg font-bold">{tweet.username}님의 게시물</span>
          </div>
          <div className="scrollbar-custom grow overflow-y-auto p-3">
            <TweetDetails {...tweet} currentUserId={myInfo!.id} {...likeData} />
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
