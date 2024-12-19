"use client";

import FormButton from "@/components/formButton";
import FormInput from "@/components/formInput";
import { EnvelopeIcon, UserIcon, KeyIcon } from "@heroicons/react/24/solid";
import { useActionState } from "react";
import { handleForm } from "./action";

export default function Login() {
  const [state, action] = useActionState(handleForm, null);

  return (
    <div className="mx-auto mt-12 max-w-screen-sm px-3">
      <span className="mb-10 block w-full text-center text-4xl">Moments</span>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          type="email"
          name="email"
          placeholder="이메일"
          required
          defaultValue={state && state.data.email}
          Icon={EnvelopeIcon}
          errorMessage={state?.errors?.email}
        />
        <FormInput
          type="text"
          name="username"
          placeholder="이름"
          required
          defaultValue={state && state.data.username}
          Icon={UserIcon}
          errorMessage={state?.errors?.username}
        />
        <FormInput
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          defaultValue={state && state.data.password}
          Icon={KeyIcon}
          errorMessage={state?.errors?.password}
        />
        <FormButton>로그인</FormButton>
      </form>
      {state?.success && <span>성공</span>}
    </div>
  );
}
