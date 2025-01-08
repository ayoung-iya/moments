"use server";

import { ERROR_MESSAGE } from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const tweetSchema = z.object({
  tweet: z
    .string({
      required_error: ERROR_MESSAGE.tweet.required,
    })
    .min(1, ERROR_MESSAGE.tweet.required),
  photo: z.string().optional(),
});

export const handleForm = async (_: any, formData: FormData) => {
  const data = {
    tweet: formData.get("tweet") as string,
    photo: formData.get("photo"),
  };

  const result = tweetSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: { ...result.error.flatten().fieldErrors, session: null },
      data,
    };
  }

  const session = await getSession();

  if (!session.id) {
    return {
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
      user: {
        connect: {
          id: session.id,
        },
      },
    },
  });

  redirect("/tweet");
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
