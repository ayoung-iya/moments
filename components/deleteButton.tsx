"use client";

import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";

interface DeleteButtonProps {
  children: ReactNode;
  onDeleteClick: () => Promise<void>;
}

export default function DeleteButton({ children, onDeleteClick }: DeleteButtonProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const handleDeleteClick = async () => {
    setIsLoading(true);
    await onDeleteClick();
    setIsLoading(false);
    closeModal();
  };

  return (
    <>
      <button onClick={openModal}>{children}</button>
      {isOpenModal &&
        createPortal(
          <>
            <div className="fixed inset-0 z-50 bg-stone-100 bg-opacity-80" onClick={closeModal} />
            <div className="modal fixed left-1/2 top-1/2 z-50 min-w-80 -translate-x-1/2 -translate-y-1/2">
              <div className="mx-3 rounded-md bg-white p-7 py-5 shadow md:mx-auto">
                <div className="mt-10 flex flex-col gap-8">
                  <p className="px-10 text-center">정말 삭제하시겠습니까?</p>
                  <div className="flex justify-end gap-2 *:basis-full *:rounded-md sm:*:basis-auto">
                    <button onClick={closeModal} className="px-5 py-2 hover:bg-stone-100">
                      취소
                    </button>
                    <button className="primary-button w-fit px-5 py-2" disabled={isLoading} onClick={handleDeleteClick}>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.getElementById("modal")!,
        )}
    </>
  );
}
