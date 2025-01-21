"use client";

import { postComment } from "@/app/(tab)/tweet/[id]/action";
import { CommentsDispatchContext } from "@/context/commentsContext";
import { ChangeEventHandler, KeyboardEventHandler, startTransition, useContext, useRef, useState } from "react";
import { ToastController } from "@/context/toastContext";

const TEXTAREA_MAX_HEIGHT = 200;

interface CommentForm {
  tweetId: number;
  username: string;
}

export default function CommentForm({ tweetId, username }: CommentForm) {
  const [comment, setComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addComment } = useContext(CommentsDispatchContext);
  const { showToast } = useContext(ToastController);

  const handleValueChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setComment(e.target.value);

    if (textareaRef?.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      return;
    }

    if (e.key === "Enter" && !comment.trim()) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && comment.trim()) {
      e.preventDefault();
      startTransition(() => {
        if (!e.currentTarget.form) {
          return;
        }
        action(new FormData(e.currentTarget.form));
      });
      setComment("");
    }
  };

  const action = async (formData: FormData) => {
    const comment = formData.get("comment");

    if (comment instanceof File || !comment) {
      showToast({
        message: "적절하지 않은 댓글 형식입니다.",
        status: "error",
      });
      return;
    }

    addComment(comment, username);
    setComment("");
    const result = await postComment(tweetId, comment);

    if (!result.success) {
      showToast({
        message: result.error!.message,
        status: "error",
      });

      return;
    }
  };

  return (
    <form action={action}>
      <div className="flex shrink-0 flex-col items-center px-3 py-2">
        <textarea
          name="comment"
          className="scrollbar-custom my-2 w-full grow resize-none outline-none"
          onChange={handleValueChange}
          onKeyDown={handleKeyDown}
          value={comment}
          ref={textareaRef}
          rows={1}
          placeholder="댓글을 입력하세요..."
        />
        <button
          className="self-end whitespace-nowrap p-1 font-bold text-stone-700 disabled:text-stone-300"
          disabled={!comment.trim()}
        >
          댓글
        </button>
      </div>
    </form>
  );
}
