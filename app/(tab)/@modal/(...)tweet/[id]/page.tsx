import NewComment from "@/components/commentForm";
import TweetDetails from "@/components/tweetDetails";
import FramedInterceptModal from "@/components/framedInterceptModal";
import db from "@/lib/db";

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

export default async function ModalTweet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!Number.isInteger(+id)) {
    return null;
  }

  const tweet = await fetchTweet(+id);
  if (!tweet) {
    return null;
  }

  return (
    <FramedInterceptModal>
      <div className="flex h-full flex-col divide-y">
        <div className="flex h-14 shrink-0 items-center justify-center">
          <span className="text-lg font-bold">{tweet.username}님의 게시물</span>
        </div>
        <div className="scrollbar-custom grow overflow-y-auto p-3">
          <TweetDetails {...tweet} />
          {/* 댓글리스트 */}
        </div>
        <NewComment />
      </div>
    </FramedInterceptModal>
  );
}
