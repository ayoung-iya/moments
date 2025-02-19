import ChatInput from "@/components/chatInput";
import ChatList from "@/components/chatList";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

const getChatroom = async (id: string) => {
  const currentUser = await getSession();
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      messages: {
        select: {
          id: true,
          payload: true,
          created_at: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      users: true,
    },
  });

  if (room) {
    const canSee = !!room.users.find(({ id }) => id === currentUser.id);
    return canSee ? room : null;
  }

  return room;
};

const getChatMessages = async (chatRoomId: string) => {
  const messages = await db.message.findMany({
    where: { chatRoomId },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return messages?.map(({ user, ...rest }) => ({ username: user.username, ...rest }));
};

export type ChatMessages = Prisma.PromiseReturnType<typeof getChatMessages>;

export default async function Chat({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = await params;
  const currentUser = await getSession();
  const room = await getChatroom(roomId);

  if (!room) {
    notFound();
  }

  const messages = await getChatMessages(roomId);

  return (
    <div className="mb-5 flex grow items-stretch gap-2 rounded-md bg-white p-3">
      <div>채팅방 리스트</div>
      <div className="grow">
        <ChatList initialMessageList={messages} currentUserId={currentUser.id!} />
      </div>
    </div>
  );
}
