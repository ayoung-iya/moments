import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { getUser } from "@/services/userService";
import { notFound, redirect } from "next/navigation";

export default async function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getSession();

  if (!Number.isInteger(+id)) {
    return notFound();
  }

  const user = await getUser(+id);
  if (!user) {
    return notFound();
  }

  const getOrCreateChatRoom = async () => {
    "use server";
    const existingRoom = await db.chatRoom.findFirst({
      where: {
        AND: [{ users: { some: { id: currentUser.id } } }, { users: { some: { id: user.id } } }],
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (existingRoom && existingRoom._count.users === 2) {
      return redirect(`/chat/${existingRoom.id}`);
    }

    const newRoom = await db.chatRoom.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: user.id }],
        },
      },
    });

    return redirect(`/chat/${newRoom.id}`);
  };

  return (
    <>
      <span>{user.username}</span>
      <form action={getOrCreateChatRoom}>{currentUser.id !== +id && <button>메시지 보내기</button>}</form>
    </>
  );
}
