"use client";

import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

interface FormButtonProps extends PropsWithChildren {
  disabled?: boolean;
}

export default function FormButton({ children, disabled }: FormButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button h-12 focus:scale-95" disabled={pending || disabled}>
      {pending ? "제출 중" : children}
    </button>
  );
}
