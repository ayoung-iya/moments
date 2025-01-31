"use client";

import { getTweets } from "@/app/(tab)/tweet/action";
import { Tweets } from "@/app/(tab)/tweet/page";
import { useEffect, useRef, useState } from "react";
import TweetDetails from "./tweetDetails";
import Tweet from "./tweet/tweet";

interface TweetListProps {
  initialData: Tweets;
  currentUserId: number;
  shouldRouteBack?: boolean;
}

export default function TweetList({ initialData, currentUserId, shouldRouteBack }: TweetListProps) {
  const [tweets, setTweets] = useState(initialData.tweets);
  const [page, setPage] = useState(initialData.currentPage);
  const [hasNextPage, setHasNextPage] = useState(initialData.hasNextPage);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && ref.current) {
        observer.unobserve(ref.current);

        const newTweets = await getTweets(page + 1);
        setTweets([...tweets, ...newTweets.tweets]);
        setPage(newTweets.currentPage);
        setHasNextPage(newTweets.hasNextPage);

        observer.observe(ref.current);
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [page, tweets]);

  useEffect(() => {
    setTweets(initialData.tweets);
    setPage(initialData.currentPage);
    setHasNextPage(initialData.hasNextPage);
  }, [initialData]);

  return (
    <div className="flex flex-col gap-5">
      {tweets.map((tweet) => (
        <Tweet key={tweet.id}>
          <TweetDetails {...tweet} currentUserId={currentUserId} shouldRouteBack={shouldRouteBack} />
        </Tweet>
      ))}
      {/* TODO: 스피너 구현 */}
      {hasNextPage && <p ref={ref}>intercept</p>}
    </div>
  );
}
