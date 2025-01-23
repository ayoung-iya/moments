import { Tweets } from "@/app/(tab)/tweet/page";
import Tweet from "./tweet/tweet";

export default function TweetDetails({
  id,
  created_at,
  tweet,
  photo,
  photoWidth,
  photoHeight,
  username,
}: Tweets["tweets"][number]) {
  return (
    <>
      <div className="flex flex-col gap-1.5 py-3">
        <Tweet.NameWithDate name={username} date={created_at} />
        <Tweet.Content>{tweet}</Tweet.Content>
      </div>
      {photo && <Tweet.Image url={photo} width={photoWidth!} height={photoHeight!} />}
      <Tweet.ButtonList>
        <Tweet.Button className="hover:bg-stone-100">좋아요</Tweet.Button>
        <Tweet.Button as="a" href={`/tweet/${id}`} className="hover:bg-stone-100">
          댓글달기
        </Tweet.Button>
      </Tweet.ButtonList>
    </>
  );
}
