"use server";

import { ERROR_MESSAGE } from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const tweetSchema = z
  .object({
    tweet: z
      .string({
        required_error: ERROR_MESSAGE.tweet.required,
      })
      .min(1, ERROR_MESSAGE.tweet.required),
    photo: z.string().optional(),
    photoWidth: z.coerce.number().optional(),
    photoHeight: z.coerce.number().optional(),
  })
  .superRefine(({ photo, photoWidth, photoHeight }, ctx) => {
    if (!(photo || photoWidth || photoHeight)) {
      return;
    }

    if (!photo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: ERROR_MESSAGE.photo.url,
        path: ["photo"],
      });
    }

    if (!(photoWidth || photoHeight)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: ERROR_MESSAGE.photo.size,
        path: ["photo"],
      });
    }
  });

export const handleForm = async (_: any, formData: FormData) => {
  const data = {
    tweet: formData.get("tweet") as string,
    photo: formData.get("photo"),
    photoWidth: formData.get("photoWidth"),
    photoHeight: formData.get("photoHeight"),
  };

  const result = tweetSchema.safeParse(data);

  if (!result.success) {
    return {
      success: result.success,
      errors: { ...result.error.flatten().fieldErrors, session: null },
      data,
    };
  }

  const session = await getSession();

  if (!session.id) {
    return {
      success: false,
      errors: {
        tweet: null,
        photo: null,
        session: ["로그인이 필요합니다."],
      },
      data,
    };
  }

  await db.tweet.create({
    data: {
      tweet: result.data.tweet,
      photo: result.data.photo || null,
      photoWidth: result.data.photoWidth || undefined,
      photoHeight: result.data.photoHeight || undefined,
      user: {
        connect: {
          id: session.id,
        },
      },
    },
  });

  revalidateTag('tweets');

  return {
    success: result.success,
    errors: null,
    data: result.data,
  };
};

export const getUploadUrl = async () => {
  const data = await (
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      },
    )
  ).json();

  return data;
};
