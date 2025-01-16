"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function FramedInterceptModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleCloseClick = () => {
    router.back();
  };

  return (
    <>
      <div className="fixed inset-0 z-10 bg-stone-100 bg-opacity-80" onClick={handleCloseClick}></div>
      <div className="modal fixed bottom-8 left-1/2 top-8 z-20 w-full min-w-80 max-w-3xl -translate-x-1/2 rounded-md">
        <div className="mx-3 h-full bg-white md:mx-auto">
          <button
            onClick={handleCloseClick}
            className="absolute right-5 top-2.5 flex size-9 items-center justify-center rounded-full hover:bg-neutral-200 md:right-2.5"
          >
            <XMarkIcon className="size-5" />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
