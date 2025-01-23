"use client";

import { Comments } from "@/app/(tab)/@modal/(...)tweet/[id]/page";
import { createContext, PropsWithChildren, RefObject, startTransition, useOptimistic, useRef } from "react";
import { flushSync } from "react-dom";

export type Comment = Pick<Comments[number], "id" | "username" | "payload"> &
  Partial<Comments[number]> & { isSending?: boolean };
type CommentsContextType = {
  optimisticComments: Comment[];
  commentsContainer: RefObject<HTMLDivElement | null>;
};
interface CommentsDispatch {
  addComment: (comment: string, username: string) => void;
  changeComment: (id: number, comment: string) => void;
  deleteComment: (id: number) => void;
}
type OptimisticAction =
  | {
      type: "added";
      comment: string;
      username: string;
    }
  | {
      type: "changed";
      id: number;
      comment: string;
    }
  | {
      type: "deleted";
      id: number;
    };

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
  changeComment: () => {},
  deleteComment: () => {},
});

const commentsReducer = (comments: Comment[], action: OptimisticAction) => {
  switch (action.type) {
    case "added": {
      return [
        { id: randomTemporaryId(), username: action.username, payload: action.comment, isSending: true },
        ...comments,
      ];
    }
    case "changed": {
      return comments.map((comment) => (comment.id === action.id ? { ...comment, payload: action.comment } : comment));
    }
    case "deleted": {
      return comments.filter((comment) => comment.id !== action.id);
    }
  }
};

export default function CommentsProvider({ comments, children }: CommentProviderProps) {
  const commentsContainer = useRef<HTMLDivElement>(null);
  const [optimisticComments, updateOptimisticComment] = useOptimistic<Comment[], OptimisticAction>(
    comments,
    commentsReducer,
  );

  const addComment = (comment: string, username: string) => {
    flushSync(() => startTransition(() => updateOptimisticComment({ type: "added", comment, username })));
    commentsContainer.current?.scrollIntoView({ behavior: "smooth" });
  };

  const changeComment = (id: number, comment: string) => {
    startTransition(() => updateOptimisticComment({ type: "changed", id, comment }));
  };

  const deleteComment = (id: number) => {
    startTransition(() => updateOptimisticComment({ type: "deleted", id }));
  };

  return (
    <CommentsContext.Provider value={{ optimisticComments, commentsContainer }}>
      <CommentsDispatchContext.Provider value={{ addComment, changeComment, deleteComment }}>
        {children}
      </CommentsDispatchContext.Provider>
    </CommentsContext.Provider>
  );
}
