"use client";

import FormButton from "@/components/formButton";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChangeEventHandler, startTransition, useContext, useState } from "react";
import { ToastController } from "@/context/toastContext";
import { MAX_IMAGE_SIZE } from "@/lib/constants";
import { cloudflareImageURL, cloudflareImageVariantURL } from "@/lib/cloudflareImageUtils";
import { getUploadUrl } from "@/app/(tab)/(default)/tweet/new/action";
import { Tweet } from "@/services/tweetService";
import { FormState } from "./tweetEditForm";

const initialPhotoSize = (width?: number | null, height?: number | null) => {
  if (!(typeof width === "number" && typeof height === "number")) {
    return null;
  }

  return { width, height };
};

const getInitialPreview = (photo?: string | null) => {
  if (!photo) {
    return "";
  }

  return cloudflareImageVariantURL(photo);
};

type TweetFormProps = Pick<Tweet, "tweet"> &
  Partial<Pick<Tweet, "photo" | "photoWidth" | "photoHeight">> &
  Pick<FormState, "errors"> & {
    buttonText?: string;
    onSubmit: (formState: FormData) => void;
  };

export default function TweetBaseForm({
  tweet: initialTweet = "",
  photo: initialPreview = "",
  photoWidth,
  photoHeight,
  buttonText = "공유하기",
  onSubmit,
  errors,
}: TweetFormProps) {
  const [tweet, setTweet] = useState(initialTweet);
  const [preview, setPreview] = useState(() => getInitialPreview(initialPreview));
  const [photoSize, setPhotoSize] = useState<{ width: number; height: number } | null>(() =>
    initialPhotoSize(photoWidth, photoHeight),
  );
  const [uploadURL, setUploadURL] = useState("");
  const [photoId, setPhotoId] = useState("");
  const { showToast } = useContext(ToastController);

  const photoRatio = photoSize ? photoSize.width / photoSize.height : 14 / 1;

  const handleTweetChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setTweet(e.target.value);
  };

  const handlePhotoChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      showToast({
        message: "최대 용량(5MB)를 초과하였습니다.",
        status: "warning",
      });

      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    const image = new Image();
    image.src = url;
    image.onload = () => {
      setPhotoSize({ width: image.width, height: image.height });
    };

    const { result, success } = await getUploadUrl();

    if (success) {
      setUploadURL(result.uploadURL);
      setPhotoId(result.id);
    }
  };

  const handlePhotoDelete = () => {
    setPreview("");
    setPhotoSize(null);
    setUploadURL("");
    setPhotoId("");
  };

  const interceptAction = async (formData: FormData) => {
    const file = formData.get("photo");

    if (file instanceof File && file.size && preview !== initialPreview) {
      if (!uploadURL) {
        showToast({
          message: "이미지 업로드에 문제가 생겼습니다. 다시 등록해주세요.",
          status: "error",
        });
        handlePhotoDelete();
        return;
      }

      const cloudflareFormData = new FormData();
      cloudflareFormData.append("file", file);
      const response = await fetch(uploadURL, {
        method: "POST",
        body: cloudflareFormData,
      });

      if (response.status !== 200) {
        console.error(response.text);

        showToast({
          message: "이미지 업로드에 문제가 생겼습니다. 다시 시도해주세요.",
          status: "error",
        });

        return;
      }

      formData.set("photo", cloudflareImageURL(photoId));
      formData.set("photoWidth", photoSize?.width + "");
      formData.set("photoHeight", photoSize?.height + "");
    } else if (initialPreview && preview.startsWith(initialPreview)) {
      formData.set("photo", initialPreview);
      formData.set("photoWidth", photoSize?.width + "");
      formData.set("photoHeight", photoSize?.height + "");
    } else {
      formData.set("photo", "");
    }

    startTransition(() => onSubmit(formData));
  };

  return (
    <form action={interceptAction} className="flex w-full flex-col gap-4">
      <div>
        <textarea
          name="tweet"
          id="tweet"
          className={`w-full resize-y rounded-md border px-3 py-2 outline-none ${errors?.tweet?.[0] ? "border-red-600" : "border-stone-400"}`}
          value={tweet}
          onChange={handleTweetChange}
          placeholder="당신의 순간을 작성해주세요."
          rows={4}
          required
        />

        {errors?.tweet?.[0] && <p className="text-sm text-red-600">{errors?.tweet?.[0]}</p>}
      </div>

      <div className="relative">
        <label
          htmlFor="photo"
          className="relative flex w-full cursor-pointer rounded-md border border-stone-200 bg-white bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${preview})`,
            aspectRatio: photoRatio,
          }}
        >
          {!preview && (
            <div className="flex w-full items-center justify-center gap-2 rounded-md text-stone-800 shadow-sm">
              <PhotoIcon className="size-6" />
              <p className="text-sm">사진 추가하기</p>
            </div>
          )}
        </label>
        {preview && (
          <button
            type="button"
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border-[1.4px] border-stone-600 bg-white hover:bg-stone-200"
            onClick={handlePhotoDelete}
          >
            <XMarkIcon className="size-4" />
          </button>
        )}
        <input type="file" name="photo" id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden" />
      </div>

      <FormButton disabled={!tweet}>{buttonText}</FormButton>
    </form>
  );
}
