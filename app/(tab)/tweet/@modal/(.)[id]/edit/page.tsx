import FramedInterceptModal from "@/components/framedInterceptModal";
import { getTweet } from "@/services/tweetService";
import { notFound, redirect } from "next/navigation";
import TweetEditForm from "@/components/tweetEditForm";
import { getSession } from "@/lib/session";

export default async function TweetEditModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { id: userId } = await getSession();
  const tweet = await getTweet(+id);

  if (!tweet) {
    notFound();
  }

  if (userId !== tweet.userId) {
    redirect("/tweet");
  }

  return (
    <FramedInterceptModal>
      <div className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center justify-center border-b">
          <span className="text-lg font-bold">게시물 수정하기</span>
        </div>
        <div className="scrollbar-custom grow overflow-y-auto p-3">
          <TweetEditForm {...tweet} />
        </div>
      </div>
    </FramedInterceptModal>
  );
}
