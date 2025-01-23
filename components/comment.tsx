import { Comment as CommentProps, CommentsDispatchContext } from "@/context/commentsContext";
import { DropdownContext } from "@/context/dropdownContext";
import { formatRelativeTime } from "@/lib/utils";
import { deleteComment } from "@/services/commentService";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import CommentEditForm from "./commentEditForm";

export default function Comment({ id, username, created_at, payload, isSending }: CommentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const { deleteComment: deleteOptimisticComment } = useContext(CommentsDispatchContext);
  const { openId, toggleDropdown, ref, closeDropdown } = useContext(DropdownContext);

  const startEditing = () => {
    setIsEdit(true);
    closeDropdown();
  };
  const finishEditing = () => {
    setIsEdit(false);
  };

  const handleDeleteComment = async () => {
    deleteOptimisticComment(id);
    await deleteComment(id);
  };

  if (isEdit) {
    return (
      <div className="-mx-3">
        <CommentEditForm id={id} initialComment={payload} onFinishEdit={finishEditing} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-4">
          <span className="text-[0.8125rem] font-bold">{username}</span>
          <span className="text-xs text-stone-500">{isSending ? "게시 중..." : formatRelativeTime(created_at!)}</span>
        </div>
        <p>{payload}</p>
      </div>
      <div className="relative">
        <button onClick={toggleDropdown(id)}>
          <EllipsisVerticalIcon className="size-6 rounded-full p-1 hover:bg-stone-100" />
        </button>
        {id === openId && (
          <div
            ref={ref}
            className="absolute right-0 top-6 z-10 flex w-fit flex-col gap-0.5 rounded-md bg-white shadow *:px-4 *:py-1.5"
          >
            <button className="whitespace-nowrap px-2 py-1 text-sm hover:bg-stone-100" onClick={startEditing}>
              수정
            </button>
            <button className="px-2 py-1 text-sm text-red-500 hover:bg-stone-100" onClick={handleDeleteComment}>
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
