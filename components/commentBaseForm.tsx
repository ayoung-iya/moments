"use client";

import { ChangeEventHandler, KeyboardEventHandler, startTransition, useContext, useEffect, useRef } from "react";
import { ToastController } from "@/context/toastContext";

const TEXTAREA_MAX_HEIGHT = 200;

interface CommentFormParams {
  comment: string;
  handleCommentChange: (comment: string) => void;
  handleSubmit: () => Promise<{ success: boolean; error?: { message: string } }>;
  onClickCancel?: () => void;
  isFocus?: boolean;
}

export default function CommentForm({
  comment,
  handleCommentChange,
  handleSubmit,
  isFocus = false,
  onClickCancel,
}: CommentFormParams) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useContext(ToastController);

  const handleValueChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    handleCommentChange(e.target.value);

    if (textareaRef?.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, TEXTAREA_MAX_HEIGHT) + 4}px`;
    }
  };

  const handleCancelClick = () => {
    onClickCancel?.();
    handleCommentChange("");
    textareaRef.current?.blur();
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

    const result = await handleSubmit();

    if (!result.success) {
      showToast({
        message: result.error!.message,
        status: "error",
      });

      return;
    }
  };

  useEffect(() => {
    if (!(textareaRef.current && isFocus)) {
      return;
    }

    textareaRef.current.focus();
    const length = textareaRef.current.value.length;
    textareaRef.current.setSelectionRange(length, length);
  }, []);

  return (
    <form action={action}>
      <div className="flex shrink-0 flex-col items-center px-3 py-2">
        <textarea
          name="comment"
          className="scrollbar-custom my-2 h-6 w-full grow resize-none border-b border-stone-200 outline-none focus:border-stone-500"
          onChange={handleValueChange}
          onKeyDown={handleKeyDown}
          value={comment}
          ref={textareaRef}
          rows={1}
          placeholder="댓글을 입력하세요..."
        />
        <div className="flex gap-1 self-end">
          <button
            className="shrink-0 rounded-md px-2 py-1 text-stone-700 hover:bg-stone-100"
            onClick={handleCancelClick}
          >
            취소
          </button>
          <button
            className="shrink-0 rounded-md px-2 py-1 font-bold text-stone-700 hover:bg-stone-100 disabled:bg-white disabled:text-stone-300 hover:disabled:bg-white"
            disabled={!comment.trim()}
          >
            댓글
          </button>
        </div>
      </div>
    </form>
  );
}
