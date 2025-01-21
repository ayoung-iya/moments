"use client";

import { Comments } from "@/app/(tab)/@modal/(...)tweet/[id]/page";
import { createContext, PropsWithChildren, RefObject, startTransition, useOptimistic, useRef } from "react";
import { flushSync } from "react-dom";

type Comment = Pick<Comments[number], "id" | "username" | "payload"> &
  Partial<Comments[number]> & { isSending?: boolean };
type CommentsContextType = {
  optimisticComments: Comment[];
  commentsContainer: RefObject<HTMLDivElement | null>;
};
interface CommentsDispatch {
  addComment: (comment: string, username: string) => void;
}
interface OptimisticAction {
  newComment: string;
  username: string;
}
interface CommentProviderProps extends PropsWithChildren {
  comments: Comments;
}

const randomTemporaryId = () => {
  return -Math.floor(Math.random() * 1000);
};

export const CommentsContext = createContext<CommentsContextType>({
  optimisticComments: [],
  commentsContainer: { current: null },
});
export const CommentsDispatchContext = createContext<CommentsDispatch>({
  addComment: () => {},
});

export default function CommentsProvider({ comments, children }: CommentProviderProps) {
  const commentsContainer = useRef<HTMLDivElement>(null);
  const [optimisticComments, addOptimisticComment] = useOptimistic<Comment[], OptimisticAction>(
    comments,
    (state, { newComment, username }) => [
      {
        id: randomTemporaryId(),
        username: username,
        payload: newComment,
        isSending: true,
      },
      ...state,
    ],
  );

  const addComment = (comment: string, username: string) => {
    flushSync(() => startTransition(() => addOptimisticComment({ newComment: comment, username })));
    commentsContainer.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CommentsContext.Provider value={{ optimisticComments, commentsContainer }}>
      <CommentsDispatchContext.Provider value={{ addComment }}>{children}</CommentsDispatchContext.Provider>
    </CommentsContext.Provider>
  );
}
