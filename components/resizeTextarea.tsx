"use client";

import { ChangeEventHandler, TextareaHTMLAttributes, useRef } from "react";

const TEXTAREA_MAX_HEIGHT = 200;

interface ResizeTextareaParams extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  text: string;
  handleTextChange: (text: string) => void;
  maxHeight?: number;
}

export default function ResizeTextarea({
  text,
  handleTextChange,
  maxHeight = TEXTAREA_MAX_HEIGHT,
  onKeyDown,
  placeholder,
}: ResizeTextareaParams) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleValueChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    handleTextChange(e.target.value);

    if (textareaRef?.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight) + 4}px`;
    }
  };

  return (
    <textarea
      name="comment"
      className="scrollbar-custom h-6 w-full grow resize-none bg-inherit outline-none focus:border-stone-500"
      onChange={handleValueChange}
      onKeyDown={onKeyDown}
      value={text}
      ref={textareaRef}
      rows={1}
      placeholder={placeholder}
    />
  );
}
