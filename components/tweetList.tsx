"use client";

import { getTweets } from "@/app/(tab)/tweet/action";
import { useEffect, useRef } from "react";
import TweetDetails from "./tweetDetails";
import Tweet from "./tweet/tweet";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

interface TweetListProps {
  currentUserId: number;
  shouldRouteBack?: boolean;
}

export const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.hasNextPage) {
    return null;
  }

  return `/tweets?page=${pageIndex}`;
};

export default function TweetList({ currentUserId, shouldRouteBack }: TweetListProps) {
  const { data, isLoading, isValidating, size, setSize } = useSWRInfinite(
    getKey,
    (url: string) => {
      const params = new URLSearchParams(url.split("?")[1]);
      const page = Number(params.get("page"));

      return getTweets({ page, currentUserId });
    },
    {
      revalidateAll: true,
    },
  );

  const ref = useRef<HTMLInputElement>(null);

  const tweets = data?.flatMap(({ tweets }) => tweets);
  const hasNextPage = data?.at(-1)?.hasNextPage;

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(async (entries) => {
      if (!(entries[0].isIntersecting && ref.current)) {
        return;
      }

      if (isValidating) {
        return;
      }

      setSize(size + 1);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isValidating, size, setSize]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {tweets?.map((tweet) => (
        <Tweet key={tweet.id}>
          <TweetDetails {...tweet} currentUserId={currentUserId} shouldRouteBack={shouldRouteBack} />
        </Tweet>
      ))}
      {/* TODO: 스피너 구현 */}
      {hasNextPage && <p ref={ref}>intercept</p>}
    </div>
  );
}
