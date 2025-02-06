"use client";

import { Comments } from "@/services/commentService";
import { createContext, PropsWithChildren, RefObject, startTransition, useOptimistic, useRef } from "react";
import { flushSync } from "react-dom";

export type Comment = Pick<Comments["comments"][number], "id" | "username" | "payload"> &
  Partial<Comments["comments"][number]> & { isSending?: boolean };
type CommentsContextType = {
  optimisticComments: {
    comments: Comment[];
    commentsCount: Comments["commentsCount"];
  };
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
  comments: Comments["comments"];
  commentsCount: Comments["commentsCount"];
}

const randomTemporaryId = () => {
  return -Math.floor(Math.random() * 1000);
};

export const CommentsContext = createContext<CommentsContextType>({
  optimisticComments: {
    comments: [],
    commentsCount: 0,
  },
  commentsContainer: { current: null },
});
export const CommentsDispatchContext = createContext<CommentsDispatch>({
  addComment: () => {},
  changeComment: () => {},
  deleteComment: () => {},
});

const commentsReducer = (
  { comments, commentsCount }: CommentsContextType["optimisticComments"],
  action: OptimisticAction,
) => {
  switch (action.type) {
    case "added": {
      return {
        comments: [
          { id: randomTemporaryId(), username: action.username, payload: action.comment, isSending: true },
          ...comments,
        ],
        commentsCount: commentsCount + 1,
      };
    }
    case "changed": {
      return {
        comments: comments.map((comment) =>
          comment.id === action.id ? { ...comment, payload: action.comment } : comment,
        ),
        commentsCount,
      };
    }
    case "deleted": {
      return { comments: comments.filter((comment) => comment.id !== action.id), commentsCount: commentsCount - 1 };
    }
  }
};

export default function CommentsProvider({ comments, commentsCount, children }: CommentProviderProps) {
  const commentsContainer = useRef<HTMLDivElement>(null);
  const [optimisticComments, updateOptimisticComment] = useOptimistic<
    { comments: Comment[]; commentsCount: Comments["commentsCount"] },
    OptimisticAction
  >({ comments, commentsCount }, commentsReducer);

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
