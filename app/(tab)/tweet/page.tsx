import TweetList from "@/components/tweetList";
import { getTweets } from "./action";
import { PromiseReturnType } from "@prisma/client/extension";

export type Tweets = PromiseReturnType<typeof getTweets>;

export default async function Tweet() {
  const tweetsData = await getTweets();

  return <TweetList initialData={tweetsData} />;
}
