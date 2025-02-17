import FormButton from "@/components/formButton";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";

const getUser = async () => {
  const session = await getSession();
  if (!session.id) {
    notFound();
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
  });

  return user;
};

export default async function Profile() {
  const user = await getUser();
  const logout = async () => {
    "use server";

    const session = await getSession();
    session.destroy();

    redirect("/");
  };

  return (
    <>
      <p>Welcome {user?.username}</p>
      <p>Email: {user?.email}</p>
      <form action={logout}>
        <FormButton>로그아웃</FormButton>
      </form>
    </>
  );
}
