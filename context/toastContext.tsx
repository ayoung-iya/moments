"use client";
import { ActionDispatch, createContext, PropsWithChildren, useReducer } from "react";

export type ToastStatus = "default" | "success" | "warning" | "error";
type ToastActionType = "added" | "delete";

interface Toast {
  id: string;
  message: string;
  status: ToastStatus;
}

interface ToastAction extends Partial<Omit<Toast, "id">> {
  id: string;
  type: ToastActionType;
}

interface ToastController {
  showToast: ({ message, status }: { message: string; status?: ToastStatus }) => void;
  closeToast: (id: string) => void;
}

export const ToastContext = createContext<Toast[]>([]);
export const ToastDispatchContext = createContext<ActionDispatch<[action: ToastAction]>>(() => {});
export const ToastController = createContext<ToastController>({
  showToast: () => {},
  closeToast: () => {},
});

const toastsReducer = (toasts: Toast[], action: ToastAction) => {
  switch (action.type) {
    case "added": {
      return [
        ...toasts,
        {
          id: action.id,
          message: action.message!,
          status: action.status || "default",
        },
      ];
    }
    case "delete": {
      return toasts.filter(({ id }) => id !== action.id);
    }
  }
};

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, dispatch] = useReducer(toastsReducer, []);

  const showToast: ToastController["showToast"] = ({ message, status = "default" }) => {
    const id = crypto.randomUUID();
    dispatch({
      type: "added",
      status,
      id,
      message,
    });

    setTimeout(() => closeToast(id), 3000);
  };
  const closeToast = (id: string) => {
    dispatch({
      type: "delete",
      id,
    });
  };

  return (
    <ToastContext.Provider value={toasts}>
      <ToastController.Provider value={{ showToast, closeToast }}>{children}</ToastController.Provider>
    </ToastContext.Provider>
  );
}
