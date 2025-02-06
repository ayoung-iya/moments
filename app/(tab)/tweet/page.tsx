import TweetList from "@/components/tweetList";
import { getTweets } from "./action";
import { PromiseReturnType } from "@prisma/client/extension";
import Link from "next/link";
import { getMe } from "@/services/userService";

export type Tweets = PromiseReturnType<typeof getTweets>;

export default async function Tweet() {
  const me = await getMe();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full items-center gap-2 rounded-md bg-white p-3 shadow">
        <Link
          href="/profile"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-stone-300 bg-opacity-50 text-lg font-bold text-stone-600 hover:bg-opacity-80"
        >
          {me?.username[0].toUpperCase()}
        </Link>
        <Link
          href="/tweet/new"
          className="w-full rounded-full bg-stone-300 bg-opacity-50 px-5 py-3 hover:bg-opacity-80"
        >
          어떤 순간을 경험하고 계신가요?
        </Link>
      </div>
      <TweetList currentUserId={me!.id} />
    </div>
  );
}
