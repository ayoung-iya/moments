import CommentCreateForm from "@/components/commentCreateForm";
import TweetDetails from "@/components/tweetDetails";
import FramedInterceptModal from "@/components/framedInterceptModal";
import CommentList from "@/components/commentList";
import CommentsProvider from "@/context/commentsContext";
import { getMe } from "@/services/userService";
import { getIsLike } from "@/services/likeService";
import { getComments } from "@/services/commentService";
import { getTweet } from "@/services/tweetService";

export default async function ModalTweet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const myInfo = await getMe();

  if (!Number.isInteger(+id)) {
    return null;
  }

  const tweet = await getTweet(+id);
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
