"use client";

import { Tweets } from "@/app/(tab)/tweet/page";
import Tweet from "./tweet/tweet";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteButton from "./deleteButton";
import { deleteTweet } from "@/services/tweetService";
import { useRouter } from "next/navigation";
import { FireIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { startTransition, useContext, useOptimistic } from "react";
import { dislikeTweet, likeTweet } from "@/services/likeService";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getKey } from "./tweetList";
import { CommentsContext } from "@/context/commentsContext";
import Link from "next/link";

type TweetDetailsProps = Omit<Tweets["tweets"][number], "commentsCount"> & {
  commentsCount?: number;
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
  isLiked,
  likeCount,
  commentsCount,
  currentUserId,
  shouldRouteBack,
}: TweetDetailsProps) {
  const route = useRouter();
  const [likeInfo, setLikeInfo] = useOptimistic({ isLiked, likeCount }, (previousState) => ({
    isLiked: !previousState.isLiked,
    likeCount: previousState.isLiked ? previousState.likeCount - 1 : previousState.likeCount + 1,
  }));
  const { optimisticComments } = useContext(CommentsContext);

  const handleDeleteClick = async () => {
    try {
      await deleteTweet(id);

      mutate(unstable_serialize(getKey));
      if (shouldRouteBack) {
        route.back();
      }
    } catch {
      console.error("삭제 실패");
    }
  };

  const handleLikeClick = async () => {
    startTransition(() => setLikeInfo(null));
    try {
      if (likeInfo.isLiked) {
        await dislikeTweet(id);
      } else {
        await likeTweet(id);
      }

      mutate(unstable_serialize(getKey));
    } catch {
      startTransition(() => setLikeInfo(null));
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1.5 pt-3">
        <div className="flex items-center justify-between">
          <Tweet.NameWithDate name={username} date={created_at} />
          {currentUserId === userId && (
            <Tweet.ButtonList>
              <Link href={`/tweet/${id}/edit`}>
                <PencilIcon className="size-4 text-stone-800" />
              </Link>
              <DeleteButton onDeleteClick={handleDeleteClick}>
                <TrashIcon className="size-4 text-red-700" />
              </DeleteButton>
            </Tweet.ButtonList>
          )}
        </div>
        <Tweet.Content>{tweet}</Tweet.Content>
      </div>
      {photo && <Tweet.Image url={photo} width={photoWidth!} height={photoHeight!} />}
      <div className={`flex justify-end gap-3 pb-3 text-[13px] text-stone-600 ${photo ? "pt-3" : ""}`}>
        <div className="flex items-center gap-1">
          <FireIcon className="size-4" />
          <span>{likeInfo.likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <ChatBubbleOvalLeftEllipsisIcon className="size-4" />
          <span>{commentsCount || optimisticComments.commentsCount}</span>
        </div>
      </div>
      <div className="border-t py-1">
        <Tweet.ButtonList>
          <button
            className={`flex justify-center gap-1 hover:bg-stone-100 ${likeInfo.isLiked ? "*:text-red-700" : ""}`}
            onClick={handleLikeClick}
          >
            <FireIcon className="size-5 text-stone-600" />
            <span>좋아요</span>
          </button>
          <Link href={`/tweet/${id}`} className="hover:bg-stone-100">
            댓글달기
          </Link>
        </Tweet.ButtonList>
      </div>
    </>
  );
}
