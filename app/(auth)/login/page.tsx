"use client";

import FormButton from "@/components/formButton";
import Input from "@/components/input";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/solid";
import { useActionState } from "react";
import { handleForm } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Link from "next/link";

export default function Login() {
  const [state, action] = useActionState(handleForm, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <Input
        type="email"
        name="email"
        placeholder="이메일"
        required
        defaultValue={state?.data.email}
        Icon={EnvelopeIcon}
        errorMessage={state?.errors?.email?.[0]}
      />
      <Input
        type="password"
        name="password"
        placeholder="비밀번호"
        required
        min={PASSWORD_MIN_LENGTH}
        defaultValue={state?.data.password}
        Icon={KeyIcon}
        errorMessage={state?.errors?.password?.[0]}
      />

      <div className="mt-5 flex w-full flex-col gap-3 sm:mt-6">
        <FormButton>로그인</FormButton>
        <div className="flex justify-center gap-2 text-sm">
          <p className="text-sm">아직 계정이 없나요?</p>
          <Link
            href="/create-account"
            className="font-medium text-yellow-800 hover:underline hover:underline-offset-1 focus:underline focus:underline-offset-1"
          >
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
}
