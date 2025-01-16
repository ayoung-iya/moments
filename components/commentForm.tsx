"use client";

import { ChangeEventHandler, useRef, useState } from "react";

const TEXTAREA_MAX_HEIGHT = 200;

export default function CommentForm() {
  const [comment, setComment] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleValueChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setComment(e.target.value);

    if (textareaRef?.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-center px-3 py-2">
      <textarea
        name="comment"
        className="scrollbar-custom my-2 w-full grow resize-none outline-none"
        onChange={handleValueChange}
        value={comment}
        ref={textareaRef}
        rows={1}
        placeholder="댓글을 입력하세요..."
      />
      <button
        className="self-end whitespace-nowrap p-1 font-bold text-stone-700 disabled:text-stone-300"
        disabled={!comment}
      >
        댓글
      </button>
    </div>
  );
}
