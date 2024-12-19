"use server";

export const handleForm = async (prevData: any, formData: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (password !== "1234") {
    return {
      data: {
        email,
        username,
        password,
      },
      errors: {
        password: "비밀번호가 잘못 되었습니다",
      },
    };
  }

  return {
    success: true,
    data: {
      email,
      username,
      password,
    },
  };
};
