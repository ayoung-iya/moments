"use client";

import { CommentsContext } from "@/context/commentsContext";
import { formatRelativeTime } from "@/lib/utils";
import { useContext, useEffect } from "react";

export default function CommentList({ initialScrollToTop = false }: { initialScrollToTop?: boolean }) {
  const { optimisticComments, commentsContainer } = useContext(CommentsContext);

  useEffect(() => {
    if (!(commentsContainer.current && initialScrollToTop)) {
      return;
    }

    commentsContainer.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative flex flex-col gap-2" ref={commentsContainer}>
      {optimisticComments.map((comment) => (
        <div key={comment.id}>
          <div className="flex items-center gap-4">
            <span className="text-[0.8125rem] font-bold">{comment.username}</span>
            <span className="text-xs text-stone-500">
              {comment.isSending ? "게시 중..." : formatRelativeTime(comment.created_at!)}
            </span>
          </div>
          <p>{comment.payload}</p>
        </div>
      ))}
    </div>
  );
}
