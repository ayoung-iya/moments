"use client";

import { Tweets } from "@/app/(tab)/(default)/tweet/page";
import Tweet from "./tweet/tweet";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteButton from "./deleteButton";
import { deleteTweet } from "@/services/tweetService";
import { FireIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { startTransition, useOptimistic } from "react";
import { dislikeTweet, getIsLike, likeTweet } from "@/services/likeService";
import useSWR, { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getKey } from "./tweetList";
import Link from "next/link";
import { getCommentsCount } from "@/services/commentService";

type TweetDetailsProps = Omit<Tweets["tweets"][number], "commentsCount"> & {
  currentUserId: number;
};

export default function TweetDetailsClientFetch({
  id,
  created_at,
  tweet,
  photo,
  photoWidth,
  photoHeight,
  username,
  userId,
  currentUserId,
}: TweetDetailsProps) {
  const { data: likeData, mutate: likeMutate } = useSWR(`/tweet/${id}/like`, () => getIsLike(id, currentUserId));
  const { data: commentsData } = useSWR(`/tweet/${id}/commentsCount`, () => getCommentsCount(id));
  const [likeInfo, setLikeInfo] = useOptimistic(
    { isLiked: likeData?.isLiked || false, likeCount: likeData?.likeCount || 0 },
    (previousState) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked ? previousState.likeCount - 1 : previousState.likeCount + 1,
    }),
  );

  const handleDeleteClick = async () => {
    try {
      await deleteTweet(id);
      mutate(unstable_serialize(getKey));
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

      likeMutate();
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
      {photo && (
        <div className="mt-3">
          <Tweet.Image url={photo} width={photoWidth!} height={photoHeight!} />
        </div>
      )}
      <div className={`flex justify-end gap-3 pb-3 text-[13px] text-stone-600 ${photo ? "pt-3" : ""}`}>
        <div className="flex items-center gap-1">
          <FireIcon className="size-4" />
          <span>{likeInfo.likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <ChatBubbleOvalLeftEllipsisIcon className="size-4" />
          <span>{commentsData?.commentsCount}</span>
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
          <Link href={`/tweet/${id}`} className="hover:bg-stone-100" prefetch={false}>
            댓글달기
          </Link>
        </Tweet.ButtonList>
      </div>
    </>
  );
}
