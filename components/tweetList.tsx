"use client";

import { getTweets } from "@/app/(tab)/(default)/tweet/action";
import { Fragment, useEffect, useRef } from "react";
import Tweet from "./tweet/tweet";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import TweetDetailsClientFetch from "./tweetDetailsClientFetch";

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

export default function TweetList({ currentUserId }: TweetListProps) {
  const { data, isLoading, isValidating, size, setSize } = useSWRInfinite(
    getKey,
    (url: string) => {
      const params = new URLSearchParams(url.split("?")[1]);
      const page = Number(params.get("page"));

      return getTweets({ page });
    },
    {
      revalidateAll: true,
    },
  );

  const ref = useRef<HTMLDivElement>(null);

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
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 2 }, (_, index) => (
          <Fragment key={index}>
            <Tweet>
              <div className="animate-pulse py-3">
                <div className="mb-3 h-5 w-36 rounded-md bg-stone-200" />
                <div className="mb-3 h-5 w-4/5 rounded-md bg-stone-200" />
                <div className="aspect-[4/3] w-full rounded-md bg-stone-200" />
              </div>
            </Tweet>
            <Tweet>
              <div className="animate-pulse py-3">
                <div className="mb-3 h-5 w-36 rounded-md bg-stone-200" />
                <div className="mb-3 h-16 w-full rounded-md bg-stone-200" />
              </div>
            </Tweet>
          </Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {tweets?.map((tweet) => (
        <Tweet key={tweet.id}>
          <TweetDetailsClientFetch {...tweet} currentUserId={currentUserId} />
        </Tweet>
      ))}
      {hasNextPage && (
        <div
          className="mx-auto mt-3 size-8 animate-spin rounded-full border-2 border-stone-600/30 border-t-stone-600 sm:mt-5 sm:size-10 sm:border-4"
          ref={ref}
        />
      )}
    </div>
  );
}
