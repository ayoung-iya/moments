import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { PromiseReturnType } from "@prisma/client/extension";

export const getUser = async (userId: number) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  return user;
};

export const getMe = async () => {
  const session = await getSession();
  if (!session.id) {
    return null;
  }

  const user = getUser(session.id)

  return user;
};

export type User = PromiseReturnType<typeof getMe>