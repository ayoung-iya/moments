"use client";

import { Tweet } from "@/services/tweetService";
import { useActionState, useContext, useEffect } from "react";
import TweetBaseForm from "./tweetBaseForm";
import { redirect, useRouter } from "next/navigation";
import { ToastController } from "@/context/toastContext";
import { handleForm } from "@/app/(tab)/(default)/tweet/[id]/edit/action";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getKey } from "./tweetList";

export interface FormState {
  success: boolean;
  errors: {
    session?: string[];
    tweet?: string[];
    photo?: string[];
    photoWidth?: string[];
    photoHeight?: string[];
    permission?: string[];
  } | null;
  data: Pick<Tweet, "tweet"> & Partial<Pick<Tweet, "photo" | "photoWidth" | "photoHeight">>;
}

export default function TweetEditForm({ id, tweet, photo, photoWidth, photoHeight, userId }: Tweet) {
  const { showToast } = useContext(ToastController);
  const route = useRouter();
  const handleFormAction = async (_: FormState, formData: FormData): Promise<FormState> => {
    return await handleForm(formData, { id, userId });
  };

  const [state, action] = useActionState<FormState, FormData>(handleFormAction, {
    success: false,
    errors: null,
    data: { tweet, photo, photoWidth, photoHeight },
  });

  const sessionErrorMessage = state?.errors?.session?.[0];
  const permissionErrorMessage = state?.errors?.permission?.[0];
  const photoErrorMessage = state?.errors?.session?.[0];

  useEffect(() => {
    if (state?.success) {
      const tweetPageMutate = async() => {
        await mutate(unstable_serialize(getKey));
        route.back();
      }
      
      tweetPageMutate();
      return;
    }

    if (sessionErrorMessage) {
      showToast({
        message: sessionErrorMessage,
      });

      redirect("/login");
    }

    if (permissionErrorMessage) {
      showToast({
        message: permissionErrorMessage,
      });

      route.back();
      return;
    }

    if (photoErrorMessage) {
      showToast({
        message: photoErrorMessage,
      });
    }
  }, [sessionErrorMessage, permissionErrorMessage, photoErrorMessage, showToast, state?.success, route]);

  return <TweetBaseForm {...state.data} buttonText="수정하기" errors={state.errors} onSubmit={action} />;
}
