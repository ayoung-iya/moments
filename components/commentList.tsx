"use client";

import { CommentsContext } from "@/context/commentsContext";
import { useContext } from "react";
import Comment from "./comment";
import DropdownProvider from "@/context/dropdownContext";

export default function CommentList() {
  const { optimisticComments, commentsContainer } = useContext(CommentsContext);

  return (
    <DropdownProvider>
      <div className="relative flex flex-col gap-2" ref={commentsContainer}>
        {optimisticComments.comments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </DropdownProvider>
  );
}
