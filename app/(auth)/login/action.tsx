"use server";
import {
  ERROR_MESSAGE,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MIN_LENGTH,
  VALID_EMAIL,
} from "@/lib/constants";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string({
      required_error: ERROR_MESSAGE.email.required,
    })
    .email(ERROR_MESSAGE.email.pattern)
    .endsWith(VALID_EMAIL, ERROR_MESSAGE.email.endZod),
  username: z
    .string({
      required_error: ERROR_MESSAGE.username.required,
    })
    .min(USERNAME_MIN_LENGTH, ERROR_MESSAGE.username.required),
  password: z
    .string({
      required_error: ERROR_MESSAGE.password.required,
    })
    .min(PASSWORD_MIN_LENGTH, ERROR_MESSAGE.password.min)
    .regex(PASSWORD_REGEX, ERROR_MESSAGE.password.pattern),
});

export const handleForm = async (prevData: any, formData: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
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

  return {
    success: result.success,
    data: result.data,
  };
};
