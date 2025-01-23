"use client";

import { useContext, useState } from "react";
import CommentBaseForm from "./commentBaseForm";
import { CommentsDispatchContext } from "@/context/commentsContext";
import { postComment } from "@/services/commentService";

interface CommentCreateFormParams {
  tweetId: number;
  username: string;
}

export default function CommentCreateForm({ tweetId, username }: CommentCreateFormParams) {
  const [comment, setComment] = useState("");
  const { addComment } = useContext(CommentsDispatchContext);

  const handleCommentChange = (comment: string) => {
    setComment(comment);
  };

  const handleSubmit = async () => {
    addComment(comment, username);
    setComment("");
    const result = await postComment(tweetId, comment);
    return result;
  };

  return <CommentBaseForm comment={comment} handleCommentChange={handleCommentChange} handleSubmit={handleSubmit} />;
}
