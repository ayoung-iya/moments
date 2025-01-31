"use client";

import { Tweets } from "@/app/(tab)/tweet/page";
import Tweet from "./tweet/tweet";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteButton from "./deleteButton";
import { deleteTweet } from "@/services/tweetService";
import { useRouter } from "next/navigation";

type TweetDetailsProps = Tweets["tweets"][number] & {
  currentUserId: number;
  shouldRouteBack?: boolean;
};

export default function TweetDetails({
  id,
  created_at,
  tweet,
  photo,
  photoWidth,
  photoHeight,
  username,
  userId,
  currentUserId,
  shouldRouteBack,
}: TweetDetailsProps) {
  const route = useRouter();

  const handleDeleteClick = async () => {
    await deleteTweet(id);
    if (shouldRouteBack) {
      route.back();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1.5 py-3">
        <div className="flex items-center justify-between">
          <Tweet.NameWithDate name={username} date={created_at} />
          {currentUserId === userId && (
            <Tweet.ButtonList>
              <Tweet.Button as="a" href={`/tweet/${id}/edit`}>
                <PencilIcon className="size-4 text-stone-800" />
              </Tweet.Button>
              <DeleteButton onDeleteClick={handleDeleteClick}>
                <TrashIcon className="size-4 text-red-700" />
              </DeleteButton>
            </Tweet.ButtonList>
          )}
        </div>
        <Tweet.Content>{tweet}</Tweet.Content>
      </div>
      {photo && <Tweet.Image url={photo} width={photoWidth!} height={photoHeight!} />}
      <div className="border-t py-1">
        <Tweet.ButtonList>
          <Tweet.Button className="hover:bg-stone-100">좋아요</Tweet.Button>
          <Tweet.Button as="a" href={`/tweet/${id}`} className="hover:bg-stone-100">
            댓글달기
          </Tweet.Button>
        </Tweet.ButtonList>
      </div>
    </>
  );
}
