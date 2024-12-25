import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-screen-sm flex-col items-center justify-between px-3 py-11">
      <div className="mt-24 text-center">
        <h1 className="mb-4 text-5xl font-bold sm:text-6xl">Moments</h1>
        <p className="font-medium sm:text-lg">말하는 대로, 느끼는 대로</p>
        <p className="font-medium sm:text-lg">자유롭게 공유하세요</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Link
          href="/create-account"
          className="primary-button h-11 focus:scale-95 sm:h-12"
        >
          시작하기
        </Link>
        <div className="flex justify-center gap-2 text-sm">
          <p className="text-sm">이미 계정이 있나요?</p>
          <Link
            href="/login"
            className="font-medium text-yellow-800 hover:underline hover:underline-offset-1 focus:underline focus:underline-offset-1"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
