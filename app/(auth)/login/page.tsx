"use client";

import FormButton from "@/components/formButton";
import Input from "@/components/input";
import { EnvelopeIcon, UserIcon, KeyIcon } from "@heroicons/react/24/solid";
import { useActionState } from "react";
import { handleForm } from "./action";
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
  const [state, action] = useActionState(handleForm, null);

  return (
    <div className="mx-auto mt-12 max-w-screen-sm px-3">
      <span className="mb-10 block w-full text-center text-4xl">Moments</span>
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
          type="text"
          name="username"
          placeholder="이름"
          defaultValue={state?.data.username}
          required
          minLength={USERNAME_MIN_LENGTH}
          Icon={UserIcon}
          errorMessage={state?.errors?.username?.[0]}
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
        <FormButton>로그인</FormButton>
      </form>
      {state?.success && <span>성공</span>}
    </div>
  );
}
