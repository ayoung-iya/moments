"use server";
import { ERROR_MESSAGE } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { updateSessionUserId } from "@/lib/session";

const formSchema = z.object({
  email: z.string({
    required_error: ERROR_MESSAGE.email.required,
  }),
  password: z.string({
    required_error: ERROR_MESSAGE.password.required,
  }),
});

export const handleForm = async (prevData: any, formData: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = formSchema.safeParse(data);

  if (!result.success) {
    return {
      success: result.success,
      errors: result.error.flatten().fieldErrors,
      data,
    };
  }

  const user = await db.user.findUnique({
    where: { email: result.data.email },
    select: { id: true, password: true },
  });
  const loginError = {
    success: false,
    errors: {
      email: [ERROR_MESSAGE.login],
      password: [ERROR_MESSAGE.login],
    },
    data,
  };

  if (!user) {
    return loginError;
  }

  const ok = await bcrypt.compare(result.data.password, user.password!);

  if (!ok) {
    return loginError;
  }

  await updateSessionUserId(user.id);

  redirect("/profile");
};
