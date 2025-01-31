"use client";

import { useContext, useState } from "react";
import CommentBaseForm from "./commentBaseForm";
import { CommentsDispatchContext } from "@/context/commentsContext";
import { putComment } from "@/services/commentService";

interface CommentEditFormParams {
  id: number;
  initialComment: string;
  onFinishEdit: () => void;
}

export default function CommentEditForm({ id, initialComment, onFinishEdit }: CommentEditFormParams) {
  const [comment, setComment] = useState(initialComment);
  const { changeComment: changeOptimisticComment } = useContext(CommentsDispatchContext);

  const handleCommentChange = (comment: string) => {
    setComment(comment);
  };

  const handleSubmit = async () => {
    changeOptimisticComment(id, comment);
    onFinishEdit();
    const result = await putComment(id, comment);
    return result;
  };

  return (
    <CommentBaseForm
      comment={comment}
      handleCommentChange={handleCommentChange}
      handleSubmit={handleSubmit}
      onClickCancel={onFinishEdit}
      isFocus
    />
  );
}
