"use server";
import {
  ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_SALT_ROUNDS,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { updateSessionUserId } from "@/lib/session";

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });

  return !user;
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return !user;
};

const formSchema = z
  .object({
    email: z
      .string({
        required_error: ERROR_MESSAGE.email.required,
      })
      .email(ERROR_MESSAGE.email.pattern)
      .refine(checkUniqueEmail, ERROR_MESSAGE.email.unique),
    username: z
      .string({
        required_error: ERROR_MESSAGE.username.required,
      })
      .min(USERNAME_MIN_LENGTH, ERROR_MESSAGE.username.required)
      .refine(checkUniqueUsername, ERROR_MESSAGE.username.unique),
    password: z
      .string({
        required_error: ERROR_MESSAGE.password.required,
      })
      .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGE.password.min)
      .regex(PASSWORD_REGEX, ERROR_MESSAGE.password.pattern),
    confirmPassword: z.string({
      required_error: ERROR_MESSAGE.password.required,
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: ERROR_MESSAGE.password.match,
        path: ["confirmPassword"],
      });
    }
  });

export const handleForm = async (prevData: any, formData: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      success: result.success,
      errors: result.error.flatten().fieldErrors,
      data,
    };
  }

  const hashedPassword = await bcrypt.hash(
    result.data.password,
    PASSWORD_SALT_ROUNDS,
  );

  const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  await updateSessionUserId(user.id);

  redirect("/profile");
};
