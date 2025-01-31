import { ERROR_MESSAGE } from "@/lib/constants";
import { z } from "zod";

export const tweetSchema = z
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
