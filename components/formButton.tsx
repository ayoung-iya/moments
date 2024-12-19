'use client'

import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

export default function FormButton({ children }: PropsWithChildren) {
  const { pending } = useFormStatus();

  return (
    <button className="secondary-button h-12 focus:scale-95" disabled={pending}>
      {pending ? "제출 중" : children}
    </button>
  );
}
