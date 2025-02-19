"use client";

import { KeyboardEventHandler, useState } from "react";
import ResizeTextarea from "./resizeTextarea";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  const handleTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      return;
    }

    if (e.key === "Enter" && !message.trim()) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();
      console.log('?')

      const form = e.currentTarget.closest("form");
      console.log(form);
      // form?.submit();
    }
  };

  return (
    <>
      <div className="flex shrink-0 items-center rounded-3xl border px-3 py-2">
        <ResizeTextarea
          text={message}
          handleTextChange={handleMessageChange}
          placeholder="메시지를 입력하세요..."
          onKeyDown={handleTextareaKeyDown}
        />
        <button
          className="shrink-0 rounded-md px-2 py-1 font-bold text-stone-700 hover:bg-stone-100 disabled:bg-inherit disabled:text-stone-300 hover:disabled:bg-inherit"
          disabled={!message.trim()}
        >
          전송
        </button>
      </div>
    </>
  );
}
