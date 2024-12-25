export const ERROR_MESSAGE = {
  email: {
    required: "이메일을 입력해주세요.",
    pattern: "적절한 이메일 형식이 아닙니다.",
    unique: "이미 존재하는 이메일입니다.",
    endZod: "zod.com 이메일만 허용합니다.",
  },
  username: {
    required: "이름을을 입력해주세요.",
    min: "이름은 최소 2자 이상이어야합니다.",
    unique: "이미 존재하는 이름입니다.",
  },
  password: {
    required: "비밀번호를 입력해주세요.",
    min: "비밀번호는 최소 10자 이상이어야합니다.",
    pattern:
      "비밀번호에는 최소 하나의 소문자, 대문자, 숫자, 그리고 특수문자(@$!%*?&)가 포함되어야 합니다.",
    match: "비밀번호가 일치하지 않습니다.",
  },
  login: '아이디 또는 비밀번호가 잘못 되었습니다.'
};

export const USERNAME_MIN_LENGTH = 2;
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const VALID_EMAIL = "@zod.com";

export const PASSWORD_SALT_ROUNDS = 12;
