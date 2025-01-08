"use client";

import { ToastContext, ToastController, ToastStatus } from "@/context/toastContext";
import { useContext } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BORDER_STYLE: Record<ToastStatus, string> = {
  default: "",
  success: "border-l-8 border-lime-400",
  warning: "border-l-8 border-orange-400",
  error: "border-l-8 border-red-400",
};

export default function ToastContainer() {
  const toasts = useContext(ToastContext);
  const { closeToast } = useContext(ToastController);

  return (
    <div className="fixed right-2 top-2 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between rounded-sm bg-stone-100 py-2 shadow-sm ${BORDER_STYLE[toast.status]}`}
        >
          <p className="px-4 text-xs">{toast.message}</p>
          <button
            type="button"
            className="mr-1 flex size-7 items-center justify-center rounded-full"
            onClick={() => closeToast(toast.id)}
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
