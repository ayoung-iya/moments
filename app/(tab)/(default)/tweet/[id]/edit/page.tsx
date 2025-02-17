import { getTweet } from "@/services/tweetService";
import { notFound, redirect } from "next/navigation";
import TweetEditForm from "@/components/tweetEditForm";
import { getSession } from "@/lib/session";

export default async function TweetEditPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="mt-5 flex w-full flex-col items-center gap-5">
      <h2 className="text-xl font-bold">게시물 수정하기</h2>
      <TweetEditForm {...tweet} />
    </div>
  );
}
